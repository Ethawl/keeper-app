import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function Auth({ isLogin }) {
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cookies, setCookie] = useCookies(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const endpoint = isLogin ? 'login' : 'signup';

        const response = await fetch(`http://localhost:8000/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.detail) {
            setError(data.detail);
        } else {
            setCookie('authToken', data.token, { path: '/' });
            setCookie('userId', data.userId, { path: '/' });
            navigate('/');
            window.location.reload();
        }
    }

    return (
        <div className='auth'>
            <div className="auth-container">
                <div className="auth-container-box">
                    <form onSubmit={handleSubmit}>
                        <h2>{isLogin ? 'Login' : 'Registration'}</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {!isLogin && (
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        )}
                        <input type="submit" className="create" value={isLogin ? 'Login' : 'Register'} />
                        {error && <p>{error}</p>}
                    </form>

                    <div className='login-register'>
                        {isLogin ? (
                            <p>Don't have an account? <a href="/register">Register</a></p>
                        ) : (
                            <p>Already have an account? <a href="/login">Login</a></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;
