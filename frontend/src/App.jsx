import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import BrowsePage from './pages/BrowsePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SubmitRecipePage from './pages/SubmitRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import CookbookPage from './pages/CookbookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/submit" element={<SubmitRecipePage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
        <Route path="/cookbook" element={<CookbookPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
