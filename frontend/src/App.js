import logo from './logo.svg';
import './App.css';
import React from 'react';
import Postpage from './component/postpage/postpage.js'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/postpage"
          element={
            <div>
              <Postpage />
            </div>
          }
        />
      </Routes>
    </Router>    
  );
}

export default App;
