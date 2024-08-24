import React, { useState } from "react";
import styles from "./styles/login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "antd";
import { useRecoilState } from "recoil";
import { userState } from "../../App.js";

function LoginPage() {
  const [, setUser] = useRecoilState(userState);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5005/admin/auth/login", {
        email: username,
        password: password,
      });

      const { token } = response.data; // Assuming backend returns email
      const email = username;

      setUser({ token, email }); // Update Recoil state with token and email
      localStorage.setItem("token", token);
      localStorage.setItem("email", username);

      navigate("/postpage");
    } catch (err) {
      setError("Login failed.");
    }
  };

  return (
    <section className="login">
      <div className={styles.background}>
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
