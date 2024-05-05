import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import ApartmentsList from './ApartmentsList';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/apartments" element={<ApartmentsList />} />
      </Routes>
    </Router>
  );
};

