import React, { useState, useEffect } from 'react';
import './App.css';
// Import Firebase auth and all the necessary functions
import { auth } from './firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

function App() {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);

  // State for login form inputs - **CHANGED loginUsername to loginEmail**
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State for registration form inputs
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Listener for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handler for Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      alert(error.message);
    }
  };

  // Handler for Email/Password Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      
      // Update the user's profile with the display name
      await updateProfile(userCredential.user, {
        displayName: registerUsername
      });

      console.log("Registration successful:", userCredential.user);
      // The onAuthStateChanged listener will automatically update the UI
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message); // Show a user-friendly error
    }
  };
  
  // Handler for Email/Password Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log("Login successful!");
      // The onAuthStateChanged listener will automatically update the UI
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message); // Show a user-friendly error
    }
  };

  // Handler for Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      alert(error.message);
    }
  };

  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => setIsActive(false);

  return (
    <>
      {user ? (
        // Logged-in view
        <div className="welcome-container">
          <h1>Welcome, {user.displayName || user.email}!</h1>
          {user.photoURL && <img src={user.photoURL} alt="User profile" style={{ borderRadius: '50%' }} />}
          <p>You have successfully logged in.</p>
          <button className="btn" onClick={handleSignOut}>Logout</button>
        </div>
      ) : (
        // Logged-out view (Login/Register Form)
        <div className={`container ${isActive ? 'active' : ''}`}>
          {/* Login Form */}
          <div className="form-box login">
            <form onSubmit={handleLoginSubmit}>
              <h1>Login</h1>
              {/* **MODIFIED THIS INPUT to accept email instead of username** */}
              <div className="input-box">
                <input type="email" placeholder="Email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <i className='bx bxs-envelope'></i>
              </div>
              <div className="input-box">
                <input type="password" placeholder="Password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <i className='bx bxs-lock-alt'></i>
              </div>
              <div className="forgot-link"><a href="/#">Forgot Password?</a></div>
              <button type="submit" className="btn">Login</button>
              <p>or login with social platforms</p>
              <div className="social-icons">
                <a href="/#" onClick={(e) => {e.preventDefault(); handleGoogleSignIn();}}><i className='bx bxl-google'></i></a>
                <a href="/#"><i className='bx bxl-facebook'></i></a>
                <a href="/#"><i className='bx bxl-github'></i></a>
                <a href="/#"><i className='bx bxl-linkedin'></i></a>
              </div>
            </form>
          </div>

          {/* Registration Form */}
          <div className="form-box register">
            <form onSubmit={handleRegisterSubmit}>
              <h1>Registration</h1>
              <div className="input-box">
                <input type="text" placeholder="Username" required value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)}/>
                <i className='bx bxs-user'></i>
              </div>
              <div className="input-box">
                <input type="email" placeholder="Email" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                <i className='bx bxs-envelope'></i>
              </div>
              <div className="input-box">
                <input type="password" placeholder="Password" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                <i className='bx bxs-lock-alt'></i>
              </div>
              <button type="submit" className="btn">Register</button>
              <p>or register with social platforms</p>
              <div className="social-icons">
                <a href="/#" onClick={(e) => {e.preventDefault(); handleGoogleSignIn();}}><i className='bx bxl-google'></i></a>
                <a href="/#"><i className='bx bxl-facebook'></i></a>
                <a href="/#"><i className='bx bxl-github'></i></a>
                <a href="/#"><i className='bx bxl-linkedin'></i></a>
              </div>
            </form>
          </div>

          {/* Toggle Panels */}
          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button type="button" className="btn register-btn" onClick={handleRegisterClick}>Register</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button type="button" className="btn login-btn" onClick={handleLoginClick}>Login</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;