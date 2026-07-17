import { useState, useEffect } from 'react';
import { api } from '../api';
import CookbookCard from '../components/CookbookCard/CookbookCard';
import './CookbookPage.css';

function CookbookPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/cookbook')
      .then((data) => setEntries(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateNotes = (entryId, notes) => {
    return api
      .put(`/cookbook/${entryId}`, { notes })
      .then((updatedEntry) => {
        setEntries((prev) =>
          prev.map((entry) =>
            entry._id === updatedEntry._id ? { ...entry, notes: updatedEntry.notes } : entry
          )
        );
      })
      .catch((err) => setError(err.message));
  };

  const handleDeleteEntry = (entryId) => {
    return api
      .delete(`/cookbook/${entryId}`)
      .then(() => {
        setEntries((prev) => prev.filter((entry) => entry._id !== entryId));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="cookbook-page">
      <h1>My Cookbook</h1>

      {loading && <p className="cookbook-page__status">Loading your cookbook...</p>}
      {error && <p className="cookbook-page__error">{error}</p>}
      {!loading && !error && entries.length === 0 && (
        <p className="cookbook-page__status">
          No saved recipes yet — browse recipes and save your favorites!
        </p>
      )}

      <div className="cookbook-page__grid">
        {entries.map((entry) => (
          <CookbookCard
            key={entry._id}
            entry={entry}
            onUpdateNotes={handleUpdateNotes}
            onDelete={handleDeleteEntry}
          />
        ))}
      </div>
    </div>
  );
}

export default CookbookPage;