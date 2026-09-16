import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { GenresPage } from './pages/GenresPage';
import { DirectorsPage } from './pages/DirectorsPage';
import { ProducersPage } from './pages/ProducersPage';
import { TypesPage } from './pages/TypesPage';
import { MediaPage } from './pages/MediaPage';

export function App() {
  return (
    <Router>
      <Navbar />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<Navigate to="/media" />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/directors" element={<DirectorsPage />} />
          <Route path="/producers" element={<ProducersPage />} />
          <Route path="/types" element={<TypesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;