import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminDashboard.module.scss';
import { useAuth } from '../../contexts/AuthContext';

const cx = classNames.bind(styles);

function AdminDashboard() {
    const { logout } = useAuth();
    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [message, setMessage] = useState('');

    const handlePostNews = (e) => {
        e.preventDefault();
        // Simulation of posting news
        setMessage('Tin tức đã được đăng thành công!');
        setNewsTitle('');
        setNewsContent('');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className={cx('admin-wrapper')}>
            <header className={cx('admin-header')}>
                <h1>Hanoi Metro - Content Management</h1>
                <button onClick={logout} className={cx('logout-btn')}>Đăng xuất</button>
            </header>

            <main className={cx('admin-content')}>
                <section className={cx('news-form')}>
                    <h2>Đăng tin tức mới</h2>
                    {message && <p className={cx('success-msg')}>{message}</p>}
                    <form onSubmit={handlePostNews}>
                        <div className={cx('form-field')}>
                            <label>Tiêu đề tin tức</label>
                            <input
                                type="text"
                                value={newsTitle}
                                onChange={(e) => setNewsTitle(e.target.value)}
                                placeholder="Nhập tiêu đề..."
                                required
                            />
                        </div>
                        <div className={cx('form-field')}>
                            <label>Nội dung</label>
                            <textarea
                                value={newsContent}
                                onChange={(e) => setNewsContent(e.target.value)}
                                placeholder="Nhập nội dung chi tiết..."
                                rows="10"
                                required
                            />
                        </div>
                        <button type="submit" className={cx('submit-btn')}>Đăng tin</button>
                    </form>
                </section>

                <section className={cx('stats-overview')}>
                    <h2>Tổng quan</h2>
                    <div className={cx('stats-grid')}>
                        <div className={cx('stat-card')}>
                            <h3>Tin tức đã đăng</h3>
                            <p className={cx('stat-number')}>24</p>
                        </div>
                        <div className={cx('stat-card')}>
                            <h3>Lượt truy cập</h3>
                            <p className={cx('stat-number')}>1.2k</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;
