import React from "react";
import styles from "./styles/register.module.css";
import { Link } from "react-router-dom";

function registerpage() {
  return (
    <section className="register">
      <div className={styles.background}>
        <div className={styles.registerContainer}>
          <span></span>
          <span></span>
          <span></span>

          <div className={styles.registerBox}>
            <form className={styles.signinForm}>
              <h2 className={styles.registerTitle}>REGISTER</h2>
              <div className={styles.inputBox}>
                <input type="text" placeholder="Username" />
              </div>
              <div className={styles.inputBox}>
                <input type="password" placeholder="Password" />
              </div>
              <div className={styles.inputBoxGroup}>
                <Link to="#">Forget Password</Link>
                <Link to="/login">Login</Link> {/* Change to Link */}
              </div>
              <div className={styles.inputBox}>
                <input type="submit" name="" value="Register" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default registerpage;
