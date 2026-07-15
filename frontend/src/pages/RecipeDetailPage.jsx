import { useParams } from 'react-router-dom';

// TODO(Claire): fetch GET /api/recipes/:id and render full detail +
// "Save to Cookbook" button (POST /api/cookbook/:recipeId).
function RecipeDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ padding: 40, fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <h2>Recipe Detail</h2>
      <p>Recipe id: {id}. Full detail view + save-to-cookbook goes here (Claire).</p>
    </div>
  );
}

export default RecipeDetailPage;
