// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();

//   const handleAutoLogin = () => {
//     console.log('🚀 AUTO-LOGIN ACTIVATED');

//     // Create guaranteed login data
//     const userData = {
//       token: 'auto-login-token-' + Date.now(),
//       user: {
//         id: 'auto-admin-id',
//         username: 'h',
//         role: 'host',
//         email: 'xhanti@admin.com'
//       }
//     };

//     // Save to localStorage and auth service
//     localStorage.setItem('token', userData.token);
//     localStorage.setItem('user', JSON.stringify(userData.user));

//     console.log('✅ Auto-login successful:', userData);

//     // Navigate directly to admin panel
//     navigate('/admin/listings');
//   };

//   return (
//     <div className="main-content">
//       <div className="container">
//         <div style={styles.loginContainer}>
//           <div style={styles.loginBox}>
//             <h1 style={styles.title}>🏠 Airbnb Host</h1>
//             <p style={styles.subtitle}>One-click access to your hosting dashboard</p>

//             <button
//               onClick={handleAutoLogin}
//               style={styles.loginButton}
//             >
//               🎯 Enter Host Dashboard
//             </button>

//             <div style={styles.status}>
//               <p>✅ <strong>Instant Access Guaranteed</strong></p>
//               <p>No backend required • No authentication</p>
//             </div>

//             <p style={styles.autoLoginLink}>
//               <a
//                 href="/auto-login"
//                 style={styles.link}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   navigate('/auto-login');
//                 }}
//               >
//                 Or try our auto-login demo with countdown →
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   loginContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '80vh',
//     padding: '2rem 0'
//   },
//   loginBox: {
//     backgroundColor: 'white',
//     padding: '3rem',
//     borderRadius: '20px',
//     boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
//     width: '100%',
//     maxWidth: '500px',
//     textAlign: 'center',
//     border: '3px solid #ff385c'
//   },
//   title: {
//     marginBottom: '1rem',
//     color: '#ff385c',
//     fontSize: '2.8rem',
//     fontWeight: 'bold'
//   },
//   subtitle: {
//     marginBottom: '2.5rem',
//     color: '#666',
//     fontSize: '1.3rem',
//     lineHeight: '1.5'
//   },
//   loginButton: {
//     width: '100%',
//     padding: '1.5rem',
//     fontSize: '1.4rem',
//     backgroundColor: '#ff385c',
//     color: 'white',
//     border: 'none',
//     borderRadius: '12px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//     marginBottom: '2rem',
//     transition: 'all 0.3s ease'
//   },
//   status: {
//     padding: '1.5rem',
//     backgroundColor: '#fff0f0',
//     borderRadius: '12px',
//     border: '2px solid #ff385c',
//     fontSize: '1rem',
//     marginBottom: '1.5rem'
//   },
//   autoLoginLink: {
//     marginTop: '1rem'
//   },
//   link: {
//     color: '#ff385c',
//     textDecoration: 'none',
//     fontWeight: '500',
//     fontSize: '1rem'
//   }
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("LOGIN ATTEMPT");

    // Create login data with entered credentials
    const userData = {
      token: "login-token-" + Date.now(),
      user: {
        id: "user-" + Date.now(),
        username: username,
        role: "host",
        email: username + "@airbnb.com",
      },
    };

    // Save to localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));

    console.log("Login successful:", userData);

    // Navigate to admin panel
    navigate("/admin/listings");
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="loginContainer">
          <div className="loginBox">
            <h1 className="title">Airbnb Host</h1>
            <p className="subtitle">Login to your hosting dashboard</p>

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              <div className="status">
                <p>Forgot your password?</p>
              </div>

              <button onClick={handleLogin} className="loginButton">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
