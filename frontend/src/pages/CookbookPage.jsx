// TODO(Claire): fetch GET /api/cookbook, render saved recipes with
// editable note/rating (PUT /api/cookbook/:recipeId) and remove (DELETE).
function CookbookPage() {
  return (
    <div style={{ padding: 40, fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <h2>My Cookbook</h2>
      <p>Saved recipes with notes/ratings go here (Claire).</p>
    </div>
  );
}

export default CookbookPage;
