import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import {
    getActiveBanners,
    getActiveNews,
    normalizeMediaUrl
} from '../../services';

// Import assets
import heroImage from '../../assets/images/img_qc.png';
import metroTrainImg from '../../assets/images/img_christmas.png';

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [banners, setBanners] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const defaultSlides = [heroImage, metroTrainImg];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannerData = await getActiveBanners();
                const newsData = await getActiveNews();
                setBanners(bannerData || []);
                setNewsList(newsData || []);
            } catch (error) {
                console.error('Failed to fetch home data', error);
            }
        };
        fetchData();
    }, []);

    const slides = banners.length > 0 ? banners.map(b => normalizeMediaUrl(b.imageUrl)) : defaultSlides;

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const navItems = [
        { title: 'Bản đồ Metro', icon: '🗺️', color: '#1d76bb', path: '/map' },
        { title: 'Hướng dẫn sử dụng', icon: '📖', color: '#2c7a7b', path: '/metro-userguide' },
        { title: 'Thông tin vé', icon: '🎟️', color: '#744210', path: '/afc-tickets' },
        { title: 'Giới thiệu công ty', icon: '🏢', color: '#170450', path: '/about' },
        { title: 'Tin tức & Thông báo', icon: '📰', color: '#1d76bb', path: '/news' }
    ];

    // Splitting news into two columns for the existing UI
    const midIndex = Math.ceil(newsList.length / 2);
    const leftNews = newsList.slice(0, 3); // Take first 3
    const rightNews = newsList.slice(3, 6); // Take next 3

    return (
        <div className={cx('page-container')}>
            <section className={cx('hero-viewport')}>
                {slides.map((src, idx) => (
                    <div
                        key={idx}
                        className={cx('slide', { active: idx === currentSlide })}
                        style={{ backgroundImage: `url(${src})` }}
                        onClick={() => {
                            if (banners[idx]?.linkUrl) {
                                window.open(banners[idx].linkUrl, '_blank');
                            }
                        }}
                    />
                ))}

                <div className={cx('hero-overlay')}>
                    <div className={cx('new-year-badge')}>
                        <span className={cx('badge-text')}>CHÚC MỪNG NĂM MỚI</span>
                        <span className={cx('badge-year')}>2026</span>
                    </div>

                    <div className={cx('circular-nav')}>
                        {navItems.map((item, idx) => (
                            <div key={idx} className={cx('nav-item')} onClick={() => navigate(item.path)}>
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
                    <div className={cx('section-header')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 className={cx('section-title')} style={{ margin: 0 }}>TIN TỨC & THÔNG BÁO</h2>
                        <button
                            style={{ background: 'none', border: 'none', color: '#1d76bb', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => navigate('/news')}
                        >
                            Xem tất cả &rarr;
                        </button>
                    </div>

                    <div className={cx('news-content')}>
                        <div className={cx('news-column')}>
                            {leftNews.length > 0 ? leftNews.map((news) => (
                                <div key={news.id} className={cx('news-entry')} onClick={() => navigate(`/news/${news.id}`)} style={{ cursor: 'pointer' }}>
                                    <div className={cx('bullet')}>
                                        <div className={cx('bullet-inner')} />
                                    </div>
                                    <p>{news.title}</p>
                                </div>
                            )) : (
                                <p style={{ color: '#999', fontSize: '14px' }}>Chưa có thông báo mới.</p>
                            )}
                        </div>
                        <div className={cx('news-divider')} />
                        <div className={cx('news-column')}>
                            {rightNews.length > 0 ? rightNews.map((news) => (
                                <div key={news.id} className={cx('news-entry')} onClick={() => navigate(`/news/${news.id}`)} style={{ cursor: 'pointer' }}>
                                    <div className={cx('bullet')}>
                                        <div className={cx('bullet-inner')} />
                                    </div>
                                    <p>{news.title}</p>
                                </div>
                            )) : rightNews.length === 0 && leftNews.length > 3 ? (
                                // Fallback if we have more than 3 news but didn't split them correctly for display
                                <p style={{ color: '#999', fontSize: '14px' }}>Hết tin tức.</p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
