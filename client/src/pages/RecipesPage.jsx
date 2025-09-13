import CreateRecipeForm from '../components/CreateRecipeForm';

function RecipesPage() {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    gap: '2rem'
  };

  return (
    <div style={pageStyle}>
      <h1>Your Recipes</h1>
      <p>Manage your custom recipes here. Create new ones to use in your meal plans.</p>
      <CreateRecipeForm />
    </div>
  );
}

export default RecipesPage;