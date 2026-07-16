
// full search/filter UI on top of this same endpoint.
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import './BrowsePage.css';

function BrowsePage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);

    setLoading(true);
    api
      .get(`/recipes?${params.toString()}`)
      .then((data) => setRecipes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="browse-page">
      <h2>Browse Recipes</h2>

      <div className="browse-filters">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>

      {loading && <p className="browse-status">Loading recipes...</p>}
      {error && <p className="browse-status">{error}</p>}
      {!loading && !error && (
        <p className="browse-status">{recipes.length} recipes found</p>
      )}

      <div className="recipe-grid">
  {recipes.slice(0, 60).map((recipe) => (
    <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="recipe-card">
      <div className="recipe-card-image">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} />
        ) : (
          <div className="recipe-card-image-placeholder">No photo</div>
        )}
      </div>
      <h3>{recipe.title}</h3>
      <div className="meta">
        {recipe.category} &middot; {recipe.prepTime} min
      </div>
    </Link>
  ))}
</div>
    </div>
  );
}

export default BrowsePage;