import React from "react";
import { atom, RecoilRoot } from "recoil";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChakraProvider } from "@chakra-ui/react"; // Ensure ChakraProvider wraps the entire app
import Login from "./component/login/login.js"; // Adjust path as necessary
import Register from "./component/register/register.js"; // Adjust path as necessary
import Postpage from "./component/postpage/postpage.js";

// Define Recoil state
export const userState = atom({
  key: "userState",
  default: null, // Default to null or any initial state
});

// Component to handle animated routes
function AnimatedRoutes() {
  const location = useLocation(); // Retrieve the current location

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/postpage"
          element={
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Postpage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// Main App component
function App() {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
