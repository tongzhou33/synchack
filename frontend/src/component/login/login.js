import React from "react";
import styles from "./styles/login.module.css";
import { Link } from "react-router-dom";

function loginpage() {
  return (
    <section className="login">
      <div className={styles.background}>
        <div className={styles.loginContainer}>
          <span></span>
          <span></span>
          <span></span>

          <div className={styles.loginBox}>
            <form className={styles.signinForm}>
              <h2 className={styles.loginTitle}>Login</h2>
              <div className={styles.inputBox}>
                <input type="text" placeholder="Username" />
              </div>
              <div className={styles.inputBox}>
                <input type="password" placeholder="Password" />
              </div>
              <div className={styles.inputBoxGroup}>
                <Link to="#">Forget Password</Link>
                <Link to="/">Register</Link> {/* Change to Link */}
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

export default loginpage;
