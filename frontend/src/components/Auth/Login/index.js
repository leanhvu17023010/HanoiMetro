import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Login.module.scss'; // Assuming styles exist or will be created
import { login as apiLogin } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const cx = classNames.bind(styles);

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ok, data } = await apiLogin({ username, password });
        if (ok && data.token) {
            login(data.token);
            navigate('/admin');
        } else {
            setError('Sai tên đăng nhập hoặc mật khẩu');
        }
    };

    return (
        <div className={cx('login-container')}>
            <form onSubmit={handleSubmit} className={cx('login-form')}>
                <h2>Hanoi Metro - Admin Login</h2>
                {error && <p className={cx('error')}>{error}</p>}
                <div className={cx('form-group')}>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className={cx('form-group')}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
