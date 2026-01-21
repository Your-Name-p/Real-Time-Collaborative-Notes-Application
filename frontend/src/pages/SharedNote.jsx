import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSharedNote();
  }, [token]);

  const fetchSharedNote = async () => {
    try {
      const { data } = await api.get(`/api/share/${token}`);
      setNote(data.note);
    } catch (error) {
      setError('Note not found or link expired');
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Shared Note</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Read-only view</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{note?.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Created by {note?.owner_name} on {new Date(note?.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="px-6 py-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{note?.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}