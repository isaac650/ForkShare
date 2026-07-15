import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm/RecipeForm';
import { api } from '../api';

function SubmitRecipePage() {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    const created = await api.post('/recipes', payload);
    navigate(`/recipes/${created._id}`);
  }

  return <RecipeForm onSubmit={handleCreate} submitLabel="Submit Recipe" />;
}

export default SubmitRecipePage;
