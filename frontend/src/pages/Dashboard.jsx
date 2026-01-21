import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      console.log('Fetching notes...');
      const response = await api.get('/api/notes');
      console.log('Notes response:', response.data);
      
      // Handle different response formats
      const notesData = response.data.notes || response.data || [];
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setError('Failed to load notes');
      setNotes([]);
    }
    setLoading(false);
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating note:', newNote);
      const response = await api.post('/api/notes', newNote);
      console.log('Create note response:', response.data);
      
      setNewNote({ title: '', content: '' });
      setShowCreateForm(false);
      fetchNotes(); // Refresh the list
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Failed to create note: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteNote = async (id) => {
    if (confirm('Delete this note?')) {
      try {
        await api.delete(`/api/notes/${id}`);
        fetchNotes(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Notes Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome, {user.name}</p>
        </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {(user.role === 'editor' || user.role === 'admin') && (
          <button onClick={() => setShowCreateForm(true)} className="btn">
            Create Note
          </button>
        )}
        <button onClick={logout} className="btn-danger">
          Logout
        </button>
      </div>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h3 style={{ marginBottom: '20px' }}>Create New Note</h3>
            <form onSubmit={createNote}>
              <div className="form-group">
                <label className="label">Title</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Enter note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="label">Content</label>
                <textarea
                  required
                  className="textarea"
                  placeholder="Enter note content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{note.title}</h3>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {user.role === 'viewer' ? (
                    <Link to={`/editor/${note.id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                      View
                    </Link>
                  ) : (
                    <>
                      <Link to={`/editor/${note.id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                        Edit
                      </Link>
                      {user.role === 'admin' && (
                        <button 
                          onClick={() => deleteNote(note.id)}
                          style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '10px' }}>
                {note.content.substring(0, 150)}...
              </p>
              <small style={{ color: '#999' }}>
                Created: {new Date(note.created_at).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <h3>No notes yet</h3>
            <p>Create your first note to get started!</p>
            {(user.role === 'editor' || user.role === 'admin') && (
              <button onClick={() => setShowCreateForm(true)} className="btn">
                Create Your First Note
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}