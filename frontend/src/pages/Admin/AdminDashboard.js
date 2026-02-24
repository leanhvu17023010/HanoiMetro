import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AdminDashboard.module.scss';
import { useAuth } from '../../contexts/AuthContext';

const cx = classNames.bind(styles);

function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const quickActions = [
        {
            title: 'Quản lý Banner',
            desc: 'Đăng và quản lý các banner quảng cáo trên trang chủ.',
            path: '/admin/content?tab=banner',
            icon: '🖼️'
        },
        {
            title: 'Quản lý Tin tức',
            desc: 'Cập nhật tin tức và thông báo vận hành Metro.',
            path: '/admin/content?tab=news',
            icon: '📰'
        },
        {
            title: 'Quản lý Khiếu nại',
            desc: 'Xem và giải quyết các phản hồi từ hành khách.',
            path: '/admin/complaints',
            icon: '📩'
        },
    ];

    return (
        <div className={cx('admin-wrapper')}>
            <header className={cx('admin-header')}>
                <h1>Hanoi Metro - Hệ thống quản trị</h1>
                <button onClick={logout} className={cx('logout-btn')}>Đăng xuất</button>
            </header>

            <main className={cx('admin-content')}>
                <section className={cx('welcome')}>
                    <h2>Chào mừng quay trở lại, Admin!</h2>
                    <p>Chọn một tác vụ bên dưới để bắt đầu quản lý nội dung hệ thống.</p>
                </section>

                <div className={cx('quick-grid')}>
                    {quickActions.map((item, idx) => (
                        <div key={idx} className={cx('action-card')} onClick={() => navigate(item.path)}>
                            <div className={cx('card-icon')}>{item.icon}</div>
                            <div className={cx('card-info')}>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <section className={cx('stats-overview')}>
                    <h2>Tổng quan hệ thống</h2>
                    <div className={cx('stats-grid')}>
                        <div className={cx('stat-card')}>
                            <h3>Banner đang hiển thị</h3>
                            <p className={cx('stat-number')}>5</p>
                        </div>
                        <div className={cx('stat-card')}>
                            <h3>Tin tức mới trong tuần</h3>
                            <p className={cx('stat-number')}>12</p>
                        </div>
                        <div className={cx('stat-card')}>
                            <h3>Khiếu nại chưa xử lý</h3>
                            <p className={cx('stat-number')}>3</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;
