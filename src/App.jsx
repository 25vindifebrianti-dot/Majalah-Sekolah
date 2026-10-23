// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FlipbookPage from './pages/FlipbookPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/majalah/:id" element={<FlipbookPage />} />
      </Routes>
    </Router>
  );
}

export default App;