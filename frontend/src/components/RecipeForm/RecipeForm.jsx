import { useState } from 'react';
import PropTypes from 'prop-types';
import './RecipeForm.css';

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'dessert'];

function RecipeForm({ initialRecipe, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [category, setCategory] = useState(initialRecipe?.category || CATEGORIES[0]);
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime || '');
  const [ingredients, setIngredients] = useState((initialRecipe?.ingredients || []).join('\n'));
  const [steps, setSteps] = useState((initialRecipe?.steps || []).join('\n'));
  const [imageUrl, setImageUrl] = useState(initialRecipe?.imageUrl || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      title,
      category,
      prepTime: Number(prepTime),
      ingredients: ingredients.split('\n').map((line) => line.trim()).filter(Boolean),
      steps: steps.split('\n').map((line) => line.trim()).filter(Boolean),
      imageUrl: imageUrl || null,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2>{submitLabel === 'Save Changes' ? 'Edit Recipe' : 'Submit a Recipe'}</h2>
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="recipe-title">Title</label>
      <input
        id="recipe-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="form-row">
        <div>
          <label htmlFor="recipe-category">Category</label>
          <select id="recipe-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="recipe-preptime">Prep Time (minutes)</label>
          <input
            id="recipe-preptime"
            type="number"
            min="1"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            required
          />
        </div>
      </div>

      <label htmlFor="recipe-ingredients">Ingredients (one per line)</label>
      <textarea
        id="recipe-ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />

      <label htmlFor="recipe-steps">Steps (one per line)</label>
      <textarea
        id="recipe-steps"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        required
      />

      <label htmlFor="recipe-image">Image URL (optional)</label>
      <input
        id="recipe-image"
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

RecipeForm.propTypes = {
  initialRecipe: PropTypes.shape({
    title: PropTypes.string,
    category: PropTypes.string,
    prepTime: PropTypes.number,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    steps: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
};

RecipeForm.defaultProps = {
  initialRecipe: null,
  submitLabel: 'Save Recipe',
};

export default RecipeForm;
