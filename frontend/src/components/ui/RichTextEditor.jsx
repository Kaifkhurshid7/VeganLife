import { useState, useRef } from 'react';
import { FiBold, FiItalic, FiCode, FiList, FiLink, FiX } from 'react-icons/fi';
import styles from './RichTextEditor.module.css';

export default function RichTextEditor({ value, onChange, placeholder = 'Share your thoughts...' }) {
  const textareaRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
      textarea.focus();
    }, 0);
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleCode = () => insertMarkdown('`', '`');
  const handleCodeBlock = () => insertMarkdown('```\n', '\n```');
  const handleList = () => insertMarkdown('- ');

  const handleLink = () => {
    if (!linkText || !linkUrl) return;
    insertMarkdown(`[${linkText}](${linkUrl})`);
    setLinkText('');
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleHashtag = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    textarea.setSelectionRange(start, start);
    insertMarkdown('#');
  };

  const handleMention = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    textarea.setSelectionRange(start, start);
    insertMarkdown('@');
  };

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <button 
            type="button" 
            className={styles.toolBtn} 
            onClick={handleBold} 
            title="Bold (Ctrl+B)"
          >
            <FiBold /> <span>Bold</span>
          </button>
          <button 
            type="button" 
            className={styles.toolBtn} 
            onClick={handleItalic} 
            title="Italic"
          >
            <FiItalic /> <span>Italic</span>
          </button>
          <button 
            type="button" 
            className={styles.toolBtn} 
            onClick={handleCode} 
            title="Inline Code"
          >
            <FiCode /> <span>Code</span>
          </button>
          <button 
            type="button" 
            className={styles.toolBtn} 
            onClick={handleCodeBlock} 
            title="Code Block"
          >
            <FiCode /> <span>Block</span>
          </button>
        </div>

        <div className={styles.toolGroup}>
          <button 
            type="button" 
            className={styles.toolBtn} 
            onClick={handleList} 
            title="List"
          >
            <FiList /> <span>List</span>
          </button>
          <button 
            type="button" 
            className={styles.toolBtn} 
            onClick={() => setShowLinkInput(!showLinkInput)} 
            title="Link"
          >
            <FiLink /> <span>Link</span>
          </button>
          <button 
            type="button" 
            className={styles.toolBtn}
            onClick={handleHashtag}
            title="Hashtag"
          >
            # <span>Tag</span>
          </button>
          <button 
            type="button" 
            className={styles.toolBtn}
            onClick={handleMention}
            title="Mention"
          >
            @ <span>Mention</span>
          </button>
        </div>
      </div>

      {showLinkInput && (
        <div className={styles.linkInput}>
          <input
            type="text"
            placeholder="Link text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <button type="button" onClick={handleLink} className={styles.linkBtn}>Add</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className={styles.linkClose}>
            <FiX />
          </button>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.textarea}
        rows={5}
      />

      <div className={styles.hint}>
        <small>
          Markdown supported: **bold**, *italic*, `code`, ```code block```, - list, [link](url), #hashtag, @mention
        </small>
      </div>
    </div>
  );
}
