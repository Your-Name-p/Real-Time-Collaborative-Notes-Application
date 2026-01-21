import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchNote();
    initSocket();
    return () => socketRef.current?.disconnect();
  }, [id]);

  const fetchNote = async () => {
    try {
      console.log('Fetching note:', id);
      const response = await api.get(`/api/notes/${id}`);
      console.log('Note response:', response.data);
      
      const noteData = response.data.note || response.data;
      setNote(noteData);
    } catch (error) {
      console.error('Failed to load note:', error);
      setError('Failed to load note');
    }
    setLoading(false);
  };

  const initSocket = () => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL);
    socketRef.current.emit('join-note', id);
    
    socketRef.current.on('note-updated', (data) => {
      if (data.userId !== user.id) {
        setNote(prev => ({ ...prev, content: data.content }));
      }
    });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setNote(prev => ({ ...prev, content: newContent }));
    
    // Send real-time update
    socketRef.current?.emit('edit-note', {
      noteId: id,
      content: newContent,
      userId: user.id
    });
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      console.log('Saving note:', note);
      await api.put(`/api/notes/${id}`, note);
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h3>Error: {error}</h3>
          <button onClick={() => navigate('/dashboard')} className="btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            ← Back
          </button>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
            style={{ fontSize: '20px', fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none' }}
            placeholder="Note title"
          />
        </div>
        <button onClick={saveNote} disabled={saving || user.role === 'viewer'} className="btn">
          {user.role === 'viewer' ? 'View Only' : (saving ? 'Saving...' : 'Save Note')}
        </button>
      </div>

      {/* Editor */}
      <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start writing your note..."
          readOnly={user.role === 'viewer'}
          style={{
            width: '100%',
            height: '500px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            lineHeight: '1.6',
            resize: 'vertical',
            fontFamily: 'inherit',
            backgroundColor: user.role === 'viewer' ? '#f5f5f5' : 'white',
            cursor: user.role === 'viewer' ? 'default' : 'text'
          }}
        />
      </div>

      {/* Info */}
      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.8)', borderRadius: '8px', fontSize: '14px', color: '#666' }}>
        {user.role === 'viewer' ? (
          <p>👁️ You are viewing this note in read-only mode</p>
        ) : (
          <p>💡 Changes are automatically synced in real-time with other collaborators</p>
        )}
        <p>📅 Last updated: {note.updated_at ? new Date(note.updated_at).toLocaleString() : 'Just now'}</p>
        <p>👤 Your role: <strong>{user.role}</strong></p>
      </div>
    </div>
  );
}