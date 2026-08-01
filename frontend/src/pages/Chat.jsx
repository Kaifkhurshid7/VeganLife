import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUsers, FiPlus, FiX, FiMenu, FiMessageSquare } from 'react-icons/fi';
import { Navbar } from '../components/layout';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../components/ui/Toast';
import { apiFetch } from '../utils/api';
import { ROOM_ICONS, resolveIcon } from '../utils/iconMap';
import styles from './Chat.module.css';

const HISTORY_LIMIT = 30;

function RoomIcon({ icon }) {
  const Icon = resolveIcon(icon);
  return <Icon />;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(iso) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function Chat() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    connected, rooms, onlineByRoom, typingByRoom, subscribe,
    sendMessage, setTyping, switchRoom, leaveRoom, markRoomRead, bumpUnread, createRoom,
  } = useChat();
  const toast = useToast();

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [roomError, setRoomError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', description: '', icon: ROOM_ICONS[0].key });
  const [creating, setCreating] = useState(false);

  const listRef = useRef(null);
  const typingTimer = useRef(null);
  const previousRoomRef = useRef(null);

  const activeRoom = rooms.find((r) => r._id === activeRoomId) || null;
  const activeTyping = typingByRoom[activeRoomId] || {};
  const typingNames = Object.values(activeTyping).map((t) => t.name);

  const loadHistory = useCallback(async (roomId, { before } = {}) => {
    const params = new URLSearchParams({ limit: String(HISTORY_LIMIT) });
    if (before) params.set('before', before);
    const res = await apiFetch(`/rooms/${roomId}/messages?${params}`);
    if (!res.ok) throw new Error('Failed to load messages');
    return res.json();
  }, []);

  // Resolve the :roomSlug param (or pick the first room) to a room id
  useEffect(() => {
    if (rooms.length === 0 || !isAuthenticated) return;
    if (slug) {
      const room = rooms.find((r) => r.slug === slug);
      if (room) {
        setRoomError(false);
        setActiveRoomId(room._id);
      } else {
        setRoomError(true);
      }
    } else if (rooms.length > 0) {
      setActiveRoomId(rooms[0]._id);
      navigate(`/chat/${rooms[0].slug}`, { replace: true });
    }
  }, [rooms, slug, isAuthenticated, navigate]);

  // Load history + join when the active room changes
  useEffect(() => {
    if (!activeRoomId) return;
    let cancelled = false;
    setLoading(true);
    setMessages([]);
    setHasMore(false);
    setNextCursor(null);

    switchRoom(activeRoomId, previousRoomRef.current);
    previousRoomRef.current = activeRoomId;
    markRoomRead(activeRoomId);
    setShowRooms(false);

    loadHistory(activeRoomId)
      .then((json) => {
        if (cancelled) return;
        setMessages(json.data || []);
        setHasMore(json.hasMore);
        setNextCursor(json.nextCursor);
        requestAnimationFrame(scrollToBottom);
      })
      .catch(() => toast.error('Failed to load chat'))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [activeRoomId]);

  // Live messages: append to the open room, bump unread elsewhere
  useEffect(() => {
    if (!activeRoomId) return;
    const unsub = subscribe('message:new', (payload) => {
      const msg = payload.message;
      if (String(msg.room) !== String(activeRoomId)) {
        bumpUnread(msg.room);
        return;
      }
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      requestAnimationFrame(scrollToBottomIfNear);
    });
    return unsub;
  }, [activeRoomId, subscribe, bumpUnread]);

  // Leave the room cleanly when navigating away from the page
  useEffect(() => () => {
    if (previousRoomRef.current) {
      setTyping(previousRoomRef.current, false);
      leaveRoom(previousRoomRef.current);
    }
  }, []);

  function scrollToBottom() {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  function scrollToBottomIfNear() {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }

  async function loadOlder() {
    if (!hasMore || loadingOlder) return;
    setLoadingOlder(true);
    const scrollHeight = listRef.current?.scrollHeight || 0;
    try {
      const json = await loadHistory(activeRoomId, { before: nextCursor });
      setMessages((prev) => [...(json.data || []), ...prev]);
      setHasMore(json.hasMore);
      setNextCursor(json.nextCursor);
      // Hold the viewport steady while prepending history
      requestAnimationFrame(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight - scrollHeight;
      });
    } catch {
      toast.error('Failed to load older messages');
    } finally {
      setLoadingOlder(false);
    }
  }

  function handleScroll(e) {
    if (e.currentTarget.scrollTop < 40 && hasMore && !loadingOlder) {
      loadOlder();
    }
  }

  function handleInput(value) {
    setInput(value);
    if (!activeRoomId) return;
    setTyping(activeRoomId, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(activeRoomId, false), 2000);
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !activeRoomId || sending) return;
    setSending(true);
    clearTimeout(typingTimer.current);
    setTyping(activeRoomId, false);
    try {
      await sendMessage(activeRoomId, text);
      setInput('');
      scrollToBottom();
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function handleCreateRoom(e) {
    e.preventDefault();
    if (!newRoom.name.trim()) return;
    setCreating(true);
    try {
      const room = await createRoom({ ...newRoom });
      toast.success('Room created');
      setShowCreate(false);
      setNewRoom({ name: '', description: '', icon: ROOM_ICONS[0].key });
      navigate(`/chat/${room.slug}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  }

  function renderMessage(msg, idx) {
    const prev = messages[idx - 1];
    const showDay = !prev || new Date(msg.createdAt).toDateString() !== new Date(prev.createdAt).toDateString();
    const isOwn = msg.sender?._id === user?.id;
    return (
      <div key={msg._id}>
        {showDay && <div className={styles.dayDivider}>{formatDay(msg.createdAt)}</div>}
        <div className={`${styles.message} ${isOwn ? styles.messageOwn : ''}`}>
          {!isOwn && (
            <span className={styles.messageAvatar}>
              {msg.sender?.avatar
                ? <img src={msg.sender.avatar} alt="" />
                : msg.sender?.name?.charAt(0) || '?'}
            </span>
          )}
          <div className={styles.messageBubble}>
            {!isOwn && <span className={styles.messageName}>{msg.sender?.name || 'Member'}</span>}
            <p>{msg.content}</p>
            <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <section className={styles.section}>
          <div className={styles.loginPrompt}>
            <FiMessageSquare className={styles.loginIcon} />
            <h2>Join the conversation</h2>
            <p>Log in to chat with the community.</p>
            <Link to="/auth" className="btn btn-primary">Login / Sign Up</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className={styles.section}>
        <div className={styles.chatLayout}>
          {/* Room sidebar */}
          <aside className={`${styles.sidebar} ${showRooms ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Channels</h2>
              <button className={styles.addRoomBtn} onClick={() => setShowCreate(true)} aria-label="Create room">
                <FiPlus />
              </button>
            </div>
            {!connected && <div className={styles.connecting}>Reconnecting…</div>}
            <div className={styles.roomList}>
              {rooms.map((room) => (
                <motion.button
                  key={room._id}
                  className={`${styles.roomItem} ${activeRoomId === room._id ? styles.roomActive : ''}`}
                  onClick={() => {
                    if (room._id !== activeRoomId) navigate(`/chat/${room.slug}`);
                    setShowRooms(false);
                  }}
                  whileHover={{ x: 4 }}
                >
                  <span className={styles.roomIcon}><RoomIcon icon={room.icon} /></span>
                  <span className={styles.roomInfo}>
                    <span className={styles.roomName}>{room.name}</span>
                    <span className={styles.roomPreview}>{room.lastMessage || 'No messages yet'}</span>
                  </span>
                  <span className={styles.roomMeta}>
                    {(onlineByRoom[room._id] || 0) > 0 && <span className={styles.onlineDot} title={`${onlineByRoom[room._id]} online`} />}
                    {room.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>{room.unreadCount > 9 ? '9+' : room.unreadCount}</span>
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </aside>

          {/* Chat window */}
          <main className={styles.main}>
            {activeRoom ? (
              <>
                <header className={styles.chatHeader}>
                  <button className={styles.mobileRoomsBtn} onClick={() => setShowRooms(true)} aria-label="Show rooms">
                    <FiMenu />
                  </button>
                  <span className={styles.chatHeaderIcon}><RoomIcon icon={activeRoom.icon} /></span>
                  <div className={styles.chatHeaderInfo}>
                    <h2 className={styles.chatTitle}>{activeRoom.name}</h2>
                    <span className={styles.onlineCount}>
                      <FiUsers /> {onlineByRoom[activeRoomId] || 0} online
                    </span>
                  </div>
                </header>

                <div className={styles.messages} ref={listRef} onScroll={handleScroll}>
                  {loading ? (
                    <div className={styles.stateMsg}>Loading messages…</div>
                  ) : messages.length === 0 ? (
                    <div className={styles.emptyChat}>
                      <span className={styles.emptyChatIcon}><RoomIcon icon={activeRoom.icon} /></span>
                      <p>Be the first to say hello in #{activeRoom.name}.</p>
                    </div>
                  ) : (
                    messages.map(renderMessage)
                  )}
                  {loadingOlder && <div className={styles.stateMsg}>Loading older messages…</div>}
                </div>

                {typingNames.length > 0 && (
                  <div className={styles.typing}>
                    <span className={styles.typingDots}><i /><i /><i /></span>
                    {typingNames.join(', ')} {typingNames.length > 1 ? 'are' : 'is'} typing…
                  </div>
                )}

                <form className={styles.composer} onSubmit={handleSend}>
                  <input
                    value={input}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder={`Message #${activeRoom.name}…`}
                    maxLength={1000}
                    autoComplete="off"
                  />
                  <motion.button type="submit" disabled={!input.trim() || sending} aria-label="Send" whileTap={{ scale: 0.92 }}>
                    <FiSend />
                  </motion.button>
                </form>
              </>
            ) : roomError ? (
              <div className={styles.notFound}>
                <h2>Room not found</h2>
                <Link to="/chat" className="btn btn-primary">Back to chat</Link>
              </div>
            ) : (
              <div className={styles.stateMsg}>Loading chat…</div>
            )}
          </main>
        </div>
      </section>

      {/* Create room modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
          >
            <motion.form
              className={styles.modal}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreateRoom}
            >
              <div className={styles.modalHeader}>
                <h3>Create a new channel</h3>
                <button type="button" className={styles.modalClose} onClick={() => setShowCreate(false)}>
                  <FiX />
                </button>
              </div>
              <input
                placeholder="Channel name"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                maxLength={60}
                required
              />
              <input
                placeholder="Description (optional)"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                maxLength={200}
              />
              <label className={styles.iconPickerLabel}>Channel icon</label>
              <div className={styles.iconPicker}>
                {ROOM_ICONS.map(({ key, label, Icon }) => (
                  <button
                    type="button"
                    key={key}
                    title={label}
                    aria-label={label}
                    className={`${styles.iconOption} ${newRoom.icon === key ? styles.iconOptionActive : ''}`}
                    onClick={() => setNewRoom({ ...newRoom, icon: key })}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
              <button type="submit" className={styles.modalSubmit} disabled={creating}>
                {creating ? 'Creating…' : 'Create Channel'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
