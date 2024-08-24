import logo from './logo.svg';
import './App.css';
import React from 'react';
import Postpage from './component/postpage/postpage.js'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
        <Route
          path="/postpage"
          element={
            <div>
              <Postpage/>
            </div>
          }
        />
      </Routes>
    </Router>    
    </ChakraProvider>
  );
}

export default App;
