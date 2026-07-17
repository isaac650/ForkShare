import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import './RecipeDetailPage.css';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    api
      .get(`/recipes/${id}`)
      .then((data) => setRecipe(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSaveToCookbook = () => {
    setSaving(true);
    setSaveMessage('');

    api
      .post('/cookbook', { recipeId: id, notes: '' })
      .then(() => setSaveMessage('Saved to your cookbook!'))
      .catch((err) => setSaveMessage(err.message))
      .finally(() => setSaving(false));
  };

  if (error) {
    return <p className="recipe-page__error">{error}</p>;
  }

  if (!recipe) {
    return <p className="recipe-page__loading">Loading recipe...</p>;
  }

  return (
    <div className="recipe-page">
      <img
        src={recipe.imageUrl || '/placeholder-recipe.png'}
        alt={recipe.title}
        className="recipe-page__image"
      />

      <h1 className="recipe-page__title">{recipe.title}</h1>
      <span className="recipe-page__category">{recipe.category}</span>

      <button
        className="recipe-page__save-button"
        onClick={handleSaveToCookbook}
        disabled={saving}
      >
        {saving ? 'Saving...' : '♡ Save to Cookbook'}
      </button>
      {saveMessage && <p className="recipe-page__save-message">{saveMessage}</p>}

      <section>
        <h2>Prep Time</h2>
        <p>{recipe.prepTime} minutes</p>
      </section>

      {recipe.ingredients?.length > 0 && (
        <section>
          <h2>Ingredients</h2>
          <ul className="recipe-page__ingredients">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps?.length > 0 && (
        <section>
          <h2>Steps</h2>
          <ol className="recipe-page__instructions">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

export default RecipeDetailPage;