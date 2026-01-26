import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import logoIcon from '../../../../assets/icons/logo_icon.png';
import guestIcon from '../../../../assets/icons/icon_guest.png';
import useLocalStorage from '../../../../hooks/useLocalStorage';

import styles from './StaffHeader.module.scss';

const cx = classNames.bind(styles);

function StaffHeader() {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [token, setToken, removeToken] = useLocalStorage('token', null);
    const [displayName, setDisplayName, removeDisplayName] = useLocalStorage(
        'displayName',
        null,
    );
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage('refreshToken', null);

    const toggleMenu = () => setMenuOpen((v) => !v);
    const handleLogout = () => {
        setShowLogoutConfirm(false);
        removeToken();
        removeRefreshToken();
        removeDisplayName();
        setMenuOpen(false);
        sessionStorage.removeItem('token');
        navigate('/', { replace: true });
    };

    return (
        <>
            <header className={cx('header')}>
                <div className={cx('logo')}>
                    <Link to="/">
                        <img src={logoIcon} alt="Hanoi Metro" className={cx('logo-image')} />
                    </Link>
                </div>
                <div className={cx('staff-info')}>
                    <span className={cx('staff-text')}>NHÂN VIÊN METRO</span>
                    <div className={cx('user-menu')}>
                        <button
                            className={cx('user-menu__trigger')}
                            onClick={toggleMenu}
                        >
                            <img src={guestIcon} alt="Staff" className={cx('user-icon')} />
                        </button>
                        {menuOpen && (
                            <div className={cx('user-menu__dropdown')}>
                                <Link
                                    to="/staff/profile"
                                    className={cx('user-menu__item')}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Hồ sơ cá nhân
                                </Link>
                                <button
                                    className={cx('user-menu__item')}
                                    onClick={() => setShowLogoutConfirm(true)}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {showLogoutConfirm && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal')}>
                        <h3 className={cx('modal-title')}>Đăng xuất?</h3>
                        <p className={cx('modal-desc')}>Bạn muốn đăng xuất khỏi tài khoản nhân viên?</p>
                        <div className={cx('modal-actions')}>
                            <button className={cx('btn', 'btn-muted')} onClick={() => setShowLogoutConfirm(false)}>Hủy</button>
                            <button className={cx('btn', 'btn-primary')} onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StaffHeader;
