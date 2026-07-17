// displays some information about a single recipe - links to the recipe's detail page
import './RecipeCard.css';

function RecipeCard({ title, category, imageUrl }) {
  return (
    <div className="recipe-card">
      <img
        src={imageUrl || '/placeholder-recipe.png'}
        alt={title}
        className="recipe-card__image"
      />
      <div className="recipe-card__content">
        <h3 className="recipe-card__title">{title}</h3>
        <span className="recipe-card__category">{category}</span>
      </div>
    </div>
  );
}

export default RecipeCard;