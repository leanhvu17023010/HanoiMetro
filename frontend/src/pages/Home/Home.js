import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';

// Import assets
import heroImage from '../../assets/images/img_qc.png';
import metroTrainImg from '../../assets/images/img_christmas.png';

const cx = classNames.bind(styles);

function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [heroImage, metroTrainImg];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const navItems = [
        { title: 'Bản đồ Metro', icon: '🗺️', color: '#1d76bb' },
        { title: 'Hướng dẫn sử dụng', icon: '📖', color: '#2c7a7b' },
        { title: 'Thông tin vé', icon: '🎟️', color: '#744210' },
        { title: 'Giới thiệu công ty', icon: '🏢', color: '#170450' },
        { title: 'Liên hệ', icon: '📞', color: '#b91c1c' }
    ];

    const notifications = {
        left: [
            'HỘI NGHỊ PHÁT ĐỘNG VÀ KÝ GIAO ƯỚC THI ĐUA NĂM 2026 CỦA KHỐI THI ĐUA SỐ 13',
            'HÀ NỘI METRO THÔNG BÁO: TỪ 01/02/2026: TUYẾN METRO 3.1 NHỔN - GA HÀ NỘI ÁP DỤNG 100% CỔNG SOÁT VÉ ĐỊNH DANH...',
            'HÀ NỘI METRO TỔ CHỨC HỘI NGHỊ TRIỂN KHAI NHIỆM VỤ CÔNG TÁC NĂM 2026'
        ],
        right: [
            'HÀ NỘI METRO HƯỚNG DẪN CHUYỂN ĐỔI VÉ CŨ SANG HỆ THỐNG MỚI – TUYẾN 3.1 NHỔN – GA HÀ NỘI',
            'HÀ NỘI METRO NHIỆT LIỆT CHÀO MỪNG ĐẠI HỘI ĐẠI BIỂU TOÀN QUỐC LẦN THỨ XIV CỦA ĐẢNG',
            'ĐOÀN THANH NIÊN HÀ NỘI METRO LAN TỎA THÔNG ĐIỆP “MỖI GIỌT MÁU CHO ĐI MỘT CUỘC ĐỜI Ở LẠI”'
        ]
    };

    return (
        <div className={cx('page-container')}>
            <section className={cx('hero-viewport')}>
                {slides.map((src, idx) => (
                    <div
                        key={idx}
                        className={cx('slide', { active: idx === currentSlide })}
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ))}

                <div className={cx('hero-overlay')}>
                    <div className={cx('new-year-badge')}>
                        <span className={cx('badge-text')}>CHÚC MỪNG NĂM MỚI</span>
                        <span className={cx('badge-year')}>2026</span>
                    </div>

                    <div className={cx('circular-nav')}>
                        {navItems.map((item, idx) => (
                            <div key={idx} className={cx('nav-item')}>
                                <div className={cx('icon-circle')}>
                                    <span className={cx('icon-label')}>{item.icon}</span>
                                </div>
                                <span className={cx('nav-text')}>{item.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className={cx('slider-arrows')}>
                        <button className={cx('arrow-btn')} onClick={() => setCurrentSlide(c => (c - 1 + slides.length) % slides.length)}>‹</button>
                        <button className={cx('arrow-btn')} onClick={() => setCurrentSlide(c => (c + 1) % slides.length)}>›</button>
                    </div>
                </div>
            </section>

            <section className={cx('news-announcement')}>
                <div className={cx('container')}>
                    <h2 className={cx('section-title')}>THÔNG BÁO</h2>
                    <div className={cx('news-content')}>
                        <div className={cx('news-column')}>
                            {notifications.left.map((text, idx) => (
                                <div key={idx} className={cx('news-entry')}>
                                    <div className={cx('bullet')}>
                                        <div className={cx('bullet-inner')} />
                                    </div>
                                    <p>{text}</p>
                                </div>
                            ))}
                        </div>
                        <div className={cx('news-divider')} />
                        <div className={cx('news-column')}>
                            {notifications.right.map((text, idx) => (
                                <div key={idx} className={cx('news-entry')}>
                                    <div className={cx('bullet')}>
                                        <div className={cx('bullet-inner')} />
                                    </div>
                                    <p>{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
