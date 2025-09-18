import { useState } from 'react';
import CreateFoodForm from '../components/CreateFoodForm';
import CreateRecipeForm from '../components/CreateRecipeForm';

function DatabasePage() {
  // State to manage which form is currently active ('food' or 'recipe')
  const [activeForm, setActiveForm] = useState('food');

  return (
    <div style={styles.pageContainer}>
      <h1>Your Food & Recipe Database</h1>
      <p>Add new food items or create custom recipes to use in your daily logs and meal plans.</p>
      
      {/* Buttons to toggle between the two forms */}
      <div style={styles.toggleContainer}>
        <button 
          style={activeForm === 'food' ? styles.activeButton : styles.button}
          onClick={() => setActiveForm('food')}
        >
          Add New Food
        </button>
        <button 
          style={activeForm === 'recipe' ? styles.activeButton : styles.button}
          onClick={() => setActiveForm('recipe')}
        >
          Create New Recipe
        </button>
      </div>
      
      {/* Conditionally render the selected form */}
      <div style={styles.formWrapper}>
        {activeForm === 'food' && <CreateFoodForm />}
        {activeForm === 'recipe' && <CreateRecipeForm />}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    width: '100%'
  },
  toggleContainer: {
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#1a1a1a',
    padding: '0.5rem',
    borderRadius: '8px'
  },
  button: {
    padding: '0.8rem 1.5rem',
    border: '1px solid transparent',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  activeButton: {
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#333',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  formWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
};


export default DatabasePage;