import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './DefaultHeader.module.scss';
import logoHanoiMetro from '../../../../assets/icons/logo_icon.png';
import { useAuth } from '../../../../contexts/AuthContext';

const cx = classNames.bind(styles);

function DefaultHeader() {
    const [isSticky, setIsSticky] = useState(false);
    const { token, logout, openLoginModal } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAuthAction = () => {
        if (token) {
            logout();
            navigate('/');
        } else {
            openLoginModal();
        }
    };

    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = searchQuery.trim().toLowerCase();
            if (query) {
                if (query.includes('hướng dẫn') || query.includes('sử dụng') || query.includes('cách')) {
                    navigate('/metro-userguide');
                } else if (query.includes('vé') || query.includes('giá') || query.includes('ticket')) {
                    navigate('/afc-tickets');
                } else if (query.includes('bản đồ') || query.includes('map') || query.includes('tuyến')) {
                    navigate('/map');
                } else if (query.includes('hỗ trợ') || query.includes('liên hệ') || query.includes('support')) {
                    navigate('/support');
                } else if (query.includes('tin') || query.includes('thông báo') || query.includes('news')) {
                    navigate('/news');
                } else {
                    // Mặc định chuyển đến trang tin tức nếu không khớp khóa nào
                    navigate(`/news?search=${encodeURIComponent(searchQuery)}`);
                }
                setShowSearch(false);
                setSearchQuery('');
            }
        }
    };

    return (
        <header className={cx('wrapper', { sticky: isSticky })}>
            <div className={cx('container')}>
                <div className={cx('header-left')}>
                    <Link to="/" className={cx('logo-container')}>
                        <img src={logoHanoiMetro} alt="Hanoi Metro" className={cx('logo')} />
                    </Link>
                    <div className={cx('slogan')}>
                        <div className={cx('slogan-line')}>Hành trình xanh</div>
                        <div className={cx('slogan-line')}>cùng Hà Nội Metro</div>
                    </div>
                </div>

                <div className={cx('header-right')}>
                    <div className={cx('navbar-actions')}>
                        {showSearch && (
                            <input
                                type="text"
                                className={cx('search-input')}
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                autoFocus
                                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                            />
                        )}
                        <div className={cx('action-box', 'search-box')} onClick={() => setShowSearch(!showSearch)}>
                            <span className={cx('icon')}>🔍</span>
                        </div>
                        <div className={cx('action-box')} onClick={handleAuthAction} title={token ? 'Đăng xuất' : 'Đăng nhập'}>
                            <span className={cx('icon')}>{token ? '🔓' : '👤'}</span>
                        </div>
                        <div className={cx('action-box')}>
                            <span className={cx('icon')}>≡</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DefaultHeader;