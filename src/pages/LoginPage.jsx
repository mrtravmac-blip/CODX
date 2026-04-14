import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, loginEmail, registerEmail, loginGoogle } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (isSignup) await registerEmail(email, password);
      else await loginEmail(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-page">
      <form onSubmit={submit} className="auth-card">
        <h1>Family Dashboard</h1>
        <p>Keep everyone connected in one safe family space.</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary">{isSignup ? 'Create account' : 'Login'}</button>
        <button type="button" className="btn-light" onClick={loginGoogle}>Continue with Google</button>
        <button type="button" className="btn-link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
        </button>
      </form>
    </main>
  );
}
