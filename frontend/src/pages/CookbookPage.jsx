import { useState, useEffect } from 'react';
import CookbookForm from '../components/CookbookForm';
import CookbookEntryCard from '../components/CookbookEntryCard';
import './Cookbook.css';

function CookbookPage() {
  const [entries, setEntries] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/cookbook')
      .then((data) => setEntries(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleAddRecipe = (formData) => {
    setSubmitting(true);
    setError('');

    api
      .post('/cookbook', formData)
      .then((newEntry) => setEntries((prev) => [...prev, newEntry]))
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  };

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
    <div>
      <h1>My Cookbook</h1>

      <CookbookForm onSubmit={handleAddRecipe} submitting={submitting} />

      {error && <p className="cookbook-page__error">{error}</p>}

      <div className="cookbook-page__grid">
        {entries.map((entry) => (
          <CookbookEntryCard
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
