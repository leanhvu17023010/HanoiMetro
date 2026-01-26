import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './DefaultHeader.module.scss';
import logoHanoiMetro from '../../../../assets/icons/logo_icon.png';

const cx = classNames.bind(styles);

function DefaultHeader() {
    const [isSticky, setIsSticky] = useState(false);

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
                        <div className={cx('action-box', 'search-box')}>
                            <span className={cx('icon')}>🔍</span>
                        </div>
                        <div className={cx('action-box')}>
                            <span className={cx('icon')}>🌐</span>
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