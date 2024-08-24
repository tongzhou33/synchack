import React, { useState } from "react";
import styles from "./styles/login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming you'll use axios for API requests
import { Alert } from "antd"; // Import Ant Design's Alert component

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use for programmatic navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend login API endpoint
      const response = await axios.post(
        "http://localhost:5005/admin/auth/login",
        {
          email: username,
          password: password,
        }
      );

      // Assuming the response contains a token and user data
      const { token } = response.data;
      localStorage.setItem("token", token); // Store token locally
      navigate("/"); // Redirect to the main page after successful login
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <section className="login">
      <div className={styles.background}>
        {/* Error popup */}
        {error && (
          <div className={styles.errorPopup}>
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          </div>
        )}
        
        <div className={styles.loginContainer}>
          <span></span>
          <span></span>
          <span></span>

          {/* Login form */}
          <div className={styles.loginBox}>
            <form className={styles.signinForm} onSubmit={handleLogin}>
              <h2 className={styles.loginTitle}>Login</h2>

              <div className={styles.inputBox}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.inputBoxGroup}>
                <Link to="#" className={styles.link}>
                  Forget Password
                </Link>
                <Link to="/register" className={styles.link}>
                  Register
                </Link>
              </div>

              <div className={styles.inputBox}>
                <input type="submit" name="" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
