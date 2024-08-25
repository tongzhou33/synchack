import React, { useState } from 'react';
import styles from './styles/register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert } from '@chakra-ui/react';

function RegisterPage() {
  // Capitalize component name for consistency
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend register API endpoint
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        email: email,
        password: password,
        name: name,
        dateOfBirth: dob,
        age: age,
        postcode: postcode,
      });

      // Assuming the response contains a token and user data
      const { token } = response.data;
      localStorage.setItem('token', token); // Store token locally
      navigate('/'); // Redirect to the main page after successful registration
      console.log('Register success');
    } catch (err) {
      setError('Registration failed. Please check your credentials and try again.');
    }
  };

  return (
    <section className='register'>
      <div className={styles.background}>
        {/* Error popup */}
        {error && (
          <div className={styles.errorPopup}>
            <Alert message='Error' description={error} type='error' showIcon closable onClose={() => setError(null)} />
          </div>
        )}

        <div className={styles.registerContainer}>
          <span></span>
          <span></span>
          <span></span>

          <div className={styles.registerBox}>
            <form className={styles.signinForm} onSubmit={handleRegister}>
              <h2 className={styles.registerTitle}>REGISTER</h2>
              <div className={styles.inputBox}>
                <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.inputBox}>
                <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.inputBox}>
                <input type='text' placeholder='Date of Birth' value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <div className={styles.inputBox}>
                <input type='number' placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className={styles.inputBox}>
                <input
                  type='text'
                  placeholder='Postcode'
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>

              <div className={styles.inputBoxGroup}>
                <Link to='#'>Forget Password</Link>
                <Link to='/'>Login</Link>
              </div>
              <div className={styles.inputBox}>
                <input type='submit' name='' value='Register' />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
