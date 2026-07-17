// handles adding and deleting recipes (based on id) from the user's cookbook

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CookbookForm.css';

function CookbookForm() {
  const [notes, setNotes] = useState('');
  const [recipeId, setRecipeId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    setSubmitting(true);

    const payload = {
      recipeId: recipeId,
      notes: notes,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {}

  return (
    <form className="cookbook-form" onSubmit={handleSubmit}>
      <h2>Edit Cookbook</h2>

      <label htmlFor="recipe-id">Recipe ID</label>
      <input
        className="cookbook-form__input"
        id="recipe-id"
        type="text"
        value={recipeId}
        onChange={(e) => setRecipeId(e.target.value)}
        required
      />
      <input
        className="cookbook-form__input"
        name="notes"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit" disabled={submitting}>
        Save Recipe To Cookbook
      </button>
      <button type="button" onClick={handleDelete}>
        Delete Recipe From Cookbook
      </button>
    </form>
  );
}

export default CookbookForm;
