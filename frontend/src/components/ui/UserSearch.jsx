import { useState, useEffect } from 'react';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from './UserSearch.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function UserSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        searchUsers();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function searchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}&limit=8`);
      if (res.ok) {
        const json = await res.json();
        setResults(json.data || []);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectUser(username) {
    navigate(`/profile/${username}`);
    setQuery('');
    setResults([]);
    setShowResults(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <FiSearch className={styles.icon} />
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className={styles.input}
        />
        {query && (
          <button 
            className={styles.clear} 
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
          >
            <FiX />
          </button>
        )}
      </div>

      {showResults && (
        <div className={styles.results}>
          {loading ? (
            <div className={styles.loading}>
              <FiLoader className={styles.spinner} />
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.list}>
              {results.map((user) => (
                <button
                  key={user._id}
                  className={styles.resultItem}
                  onClick={() => handleSelectUser(user.username)}
                >
                  <div className={styles.avatar}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.name}>{user.name}</div>
                    <div className={styles.username}>@{user.username}</div>
                  </div>
                  {user.followers?.length > 0 && (
                    <div className={styles.followers}>
                      {user.followers.length} followers
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
