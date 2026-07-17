import { useParams } from 'react-router-dom';

function RecipeDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ padding: 40, fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <h2>Recipe Detail</h2>
      <p>Recipe id: {id}.</p>
    </div>
  );
}

export default RecipeDetailPage;