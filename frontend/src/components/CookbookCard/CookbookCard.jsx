
import { useState } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import './CookbookCard.css';

function CookbookEntryCard({ entry, onUpdateNotes, onDelete }) {
  const { _id, title, category, imageUrl, notes, addedAt } = entry;
  const [isEditing, setIsEditing] = useState(false);
  const [draftNotes, setDraftNotes] = useState(notes || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateNotes(_id, draftNotes);
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftNotes(notes || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Remove "${title}" from your cookbook?`);
    if (!confirmed) return;

    setDeleting(true);
    await onDelete(_id);
  };

  return (
    <div className="cookbook-entry-card">
      <RecipeCard title={title} category={category} imageUrl={imageUrl} />

      <div className="cookbook-entry-card__info">
        {isEditing ? (
          <>
            <textarea
              className="cookbook-entry-card__notes-input"
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              rows={2}
            />
            <div className="cookbook-entry-card__actions">
              <button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {notes && <p className="cookbook-entry-card__notes">{notes}</p>}
            <button className="cookbook-entry-card__edit-btn" onClick={() => setIsEditing(true)}>
              Edit notes
            </button>
            <button
              className="cookbook-entry-card__delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Removing...' : 'Delete'}
            </button>
          </>
        )}

        <span className="cookbook-entry-card__date">
          Added {new Date(addedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default CookbookEntryCard;