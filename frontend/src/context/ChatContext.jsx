import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_URL, apiFetch } from '../utils/api';

const ChatContext = createContext(null);

// Socket.io attaches to the server root, not the /api path
const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

const TYPING_TIMEOUT_MS = 3500;

// Collapse a typing payload into the per-room map (userId -> { name, at })
function applyTyping(prev, { roomId, user, isTyping }) {
  const users = { ...(prev[roomId] || {}) };
  if (isTyping) {
    users[user.id] = { name: user.name, at: Date.now() };
  } else {
    delete users[user.id];
  }
  return { ...prev, [roomId]: users };
}

export function ChatProvider({ children }) {
  const { isAuthenticated, refreshSession } = useAuth();
  const socketRef = useRef(null);
  const subscribers = useRef(new Map());

  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [onlineByRoom, setOnlineByRoom] = useState({});
  const [typingByRoom, setTypingByRoom] = useState({});

  const subscribe = useCallback((event, cb) => {
    if (!subscribers.current.has(event)) subscribers.current.set(event, new Set());
    subscribers.current.get(event).add(cb);
    return () => subscribers.current.get(event)?.delete(cb);
  }, []);

  const publish = useCallback((event, payload) => {
    subscribers.current.get(event)?.forEach((cb) => cb(payload));
  }, []);

  const refreshRooms = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiFetch('/rooms');
      if (res.ok) {
        const json = await res.json();
        setRooms(json.data || []);
      }
    } catch {
      // keep the existing list on network failure
    }
  }, [isAuthenticated]);

  // Connect/disconnect with auth state
  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      setRooms([]);
      setOnlineByRoom({});
      setTypingByRoom({});
      return;
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      refreshRooms();
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', async () => {
      setConnected(false);
      // The access cookie can expire mid-session — rotate and reconnect once
      try {
        await refreshSession();
        if (socketRef.current) socketRef.current.connect();
      } catch {
        // leave disconnected
      }
    });

    socket.on('message:new', (payload) => {
      const msg = payload.message;
      setRooms((prev) => prev.map((room) => (
        String(room._id) === String(msg.room)
          ? { ...room, lastMessage: msg.content, lastMessageAt: msg.createdAt }
          : room
      )));
      publish('message:new', payload);
    });

    socket.on('presence:update', (payload) => {
      setOnlineByRoom((prev) => ({ ...prev, [payload.roomId]: payload.online }));
      publish('presence:update', payload);
    });

    socket.on('typing', (payload) => {
      setTypingByRoom((prev) => applyTyping(prev, payload));
      publish('typing', payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, refreshSession, refreshRooms, publish]);

  // Prune typing indicators that never got a matching "stop"
  useEffect(() => {
    const timer = setInterval(() => {
      setTypingByRoom((prev) => {
        const now = Date.now();
        let changed = false;
        const next = {};
        for (const [roomId, users] of Object.entries(prev)) {
          const kept = Object.fromEntries(
            Object.entries(users).filter(([, meta]) => now - meta.at < TYPING_TIMEOUT_MS),
          );
          if (Object.keys(kept).length > 0) next[roomId] = kept;
          if (Object.keys(kept).length !== Object.keys(users).length) changed = true;
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sendMessage = useCallback((roomId, content) => new Promise((resolve, reject) => {
    const socket = socketRef.current;
    if (!socket?.connected) return reject(new Error('Not connected'));
    socket.emit('message:send', { roomId, content }, (res) => {
      if (res?.ok) resolve(res.message);
      else reject(new Error(res?.error || 'Failed to send message'));
    });
  }), []);

  const setTyping = useCallback((roomId, isTyping) => {
    socketRef.current?.emit(isTyping ? 'typing:start' : 'typing:stop', { roomId });
  }, []);

  const switchRoom = useCallback((roomId, previousRoomId) => {
    socketRef.current?.emit('room:switch', { roomId, previousRoomId });
  }, []);

  const leaveRoom = useCallback((roomId) => {
    socketRef.current?.emit('room:leave', { roomId });
  }, []);

  const markRoomRead = useCallback((roomId) => {
    socketRef.current?.emit('read:mark', { roomId });
    setRooms((prev) => prev.map((room) => (
      String(room._id) === String(roomId) ? { ...room, unreadCount: 0 } : room
    )));
  }, []);

  const bumpUnread = useCallback((roomId) => {
    setRooms((prev) => prev.map((room) => (
      String(room._id) === String(roomId)
        ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
        : room
    )));
  }, []);

  const createRoom = useCallback(async ({ name, description, icon }) => {
    if (!isAuthenticated) throw new Error('Login required');
    const res = await apiFetch('/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, icon }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create room');
    setRooms((prev) => [...prev, json.data]);
    return json.data;
  }, [isAuthenticated]);

  const totalUnread = rooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);

  return (
    <ChatContext.Provider value={{
      connected,
      rooms,
      onlineByRoom,
      typingByRoom,
      totalUnread,
      subscribe,
      refreshRooms,
      sendMessage,
      setTyping,
      switchRoom,
      leaveRoom,
      markRoomRead,
      bumpUnread,
      createRoom,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
