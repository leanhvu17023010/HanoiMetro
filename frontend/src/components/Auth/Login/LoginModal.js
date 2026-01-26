import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useAuth } from '../../../contexts/AuthContext';
import { isValidEmail } from '../../../services/utils';
import { login as loginAPI, getMyInfo, refreshToken as refreshTokenAPI } from '../../../services/api';
import Button from '../../Common/Button';
import Notification from '../../Common/Notification/Notification';
import classNames from 'classnames/bind';
import styles from './LoginModal.module.scss';

const cx = classNames.bind(styles);

export default function LoginModal({ open = false, onClose }) {
    const navigate = useNavigate();
    const { switchToRegister, switchToForgotPassword, authRedirectPath, setAuthRedirectPath, login: setAuthToken } = useAuth();
    const [token, setLocalStorageToken] = useLocalStorage('token', null);
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage('refreshToken', null);
    const [displayName, setDisplayName] = useLocalStorage('displayName', null);
    const [savedEmail, setSavedEmail, removeSavedEmail] = useLocalStorage('savedEmail', null);

    const [email, setEmail] = useState(savedEmail || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(!!savedEmail);
    const [error, setError] = useState('');
    const [notif, setNotif] = useState({ open: false, type: 'error', title: '', message: '', duration: 3000 });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const { ok, data: loginData } = await loginAPI({ email, password });

            if (ok && loginData?.token) {
                const authToken = loginData.token;

                // Save to storage
                if (rememberMe) {
                    setLocalStorageToken(authToken);
                    setRefreshToken(authToken); // Simplification for metro
                    setSavedEmail(email);
                } else {
                    sessionStorage.setItem('token', authToken);
                    removeSavedEmail();
                }

                // Fetch user info for role redirection
                const meData = await getMyInfo(authToken);
                const userRole = meData?.role?.name || meData?.role;

                setAuthToken(authToken, userRole);

                let redirectPath = authRedirectPath || '/';
                if (userRole === 'ADMIN') redirectPath = '/admin';
                else if (userRole === 'STAFF') redirectPath = '/staff';

                onClose?.();
                navigate(redirectPath);
                // Keep the reload as a safety net for now, but the role is now synced
                window.location.reload();
            } else {
                setError('Email hoặc mật khẩu không chính xác');
            }
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className={cx('modal-inner')}>
            <div className={cx('auth-header')}>
                <h3 className={cx('auth-title')}>Đăng nhập</h3>
                <button onClick={onClose} className={cx('auth-close')}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={cx('auth-form')}>
                <div className={cx('form-group')}>
                    <label className={cx('form-label')}>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className={cx('form-input')}
                    />
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('form-label')}>Mật khẩu</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className={cx('form-input')}
                    />
                </div>

                {error && <p className={cx('error-text')}>{error}</p>}

                <div className={cx('auth-row')}>
                    <label className={cx('remember-me')}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Ghi nhớ đăng nhập
                    </label>
                    <button type="button" onClick={switchToForgotPassword} className={cx('auth-link')}>Quên mật khẩu?</button>
                </div>

                <Button type="submit" className={cx('auth-submit')} disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                </Button>
            </form>

            <p className={cx('auth-subtext')}>
                Bạn chưa có tài khoản?{' '}
                <button onClick={switchToRegister} className={cx('auth-link')}>Đăng ký</button>
            </p>
        </div>
    );
}
