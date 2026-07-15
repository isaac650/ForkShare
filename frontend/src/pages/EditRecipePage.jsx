import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm/RecipeForm';
import { api } from '../api';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .get(`/recipes/${id}`)
      .then(setRecipe)
      .catch((err) => setLoadError(err.message));
  }, [id]);

  async function handleUpdate(payload) {
    await api.put(`/recipes/${id}`, payload);
    navigate(`/recipes/${id}`);
  }

  if (loadError) return <p>{loadError}</p>;
  if (!recipe) return <p>Loading recipe...</p>;

  return <RecipeForm initialRecipe={recipe} onSubmit={handleUpdate} submitLabel="Save Changes" />;
}

export default EditRecipePage;
