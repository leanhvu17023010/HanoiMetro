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

// guidance card images
import imgChuongTrinh from '../../assets/images/chuongtrinhuudaive.png';
import imgHuongDan from '../../assets/images/huongdankhiditau.png';
import imgThongTinVe from '../../assets/images/thongtinve.png';

// Import local components
import MetroLineMap from '../../components/Home/MetroLineMap/MetroLineMap';

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

            <section className={cx('metro-announcement')}>
                <div className={cx('container')}>
                    <div className={cx('announcement-wrapper')}>
                        <h2 className={cx('announcement-title')}>THÔNG BÁO</h2>
                        <div className={cx('announcement-content')}>
                            <div className={cx('announcement-col')}>
                                {newsList.slice(0, 3).map((news) => (
                                    <div key={news.id} className={cx('announcement-item')} onClick={() => navigate(`/news/${news.id}`)}>
                                        <svg className={cx('icon')} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
                                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                                        </svg>
                                        <span className={cx('text')}>{news.title.toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={cx('divider-vertical')}></div>
                            <div className={cx('announcement-col')}>
                                {newsList.slice(3, 6).map((news) => (
                                    <div key={news.id} className={cx('announcement-item')} onClick={() => navigate(`/news/${news.id}`)}>
                                        <svg className={cx('icon')} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
                                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                                        </svg>
                                        <span className={cx('text')}>{news.title.toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MetroLineMap />

            <section className={cx('huong-dan-section')}>
                <div className={cx('container', 'huong-dan-container')}>
                    <h2 className={cx('huong-dan-main-title')}>HƯỚNG DẪN</h2>
                    <div className={cx('huong-dan-grid')}>
                        <div className={cx('huong-dan-card')} onClick={() => navigate('/afc-tickets')}>
                            <div className={cx('huong-dan-image-wrapper')}>
                                <img src={imgChuongTrinh} alt="Chương trình ưu đãi vé" />
                            </div>
                        </div>
                        <div className={cx('huong-dan-card')} onClick={() => navigate('/metro-userguide')}>
                            <div className={cx('huong-dan-image-wrapper')}>
                                <img src={imgHuongDan} alt="Hướng dẫn khi đi tàu" />
                            </div>
                        </div>
                        <div className={cx('huong-dan-card')} onClick={() => navigate('/afc-tickets')}>
                            <div className={cx('huong-dan-image-wrapper')}>
                                <img src={imgThongTinVe} alt="Thông tin vé" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={cx('news-recruitment-section')}>
                <div className={cx('container', 'split-container')}>
                    <div className={cx('metro-news')}>
                        <div className={cx('metro-header')}>
                            <h2 className={cx('metro-title')}>TIN TỨC</h2>
                        </div>

                        <div className={cx('metro-list')}>
                            {newsList.length > 0 ? newsList.slice(0, 4).map((news) => (
                                <div key={news.id} className={cx('metro-list-item')} onClick={() => navigate(`/news/${news.id}`)}>
                                    {news.imageUrl && (
                                        <div className={cx('metro-list-thumb')}>
                                            <img src={normalizeMediaUrl(news.imageUrl)} alt={news.title} />
                                        </div>
                                    )}
                                    <div className={cx('metro-list-info')}>
                                        <h3 className={cx('metro-list-title-text')}>{news.title.toUpperCase()}</h3>
                                        <p className={cx('metro-list-summary')}>{news.summary}</p>
                                    </div>
                                    <div className={cx('metro-list-action')}>
                                        <svg className={cx('chevron')} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: '#999', fontSize: '15px' }}>Chưa có tin tức mới.</p>
                            )}
                        </div>

                        {newsList.length > 0 && (
                            <div className={cx('metro-footer')}>
                                <span className={cx('view-all-link')} onClick={() => navigate('/news')}>
                                    Xem thêm...
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={cx('metro-recruitment')}>
                        <div className={cx('metro-header')}>
                            <h2 className={cx('metro-title')}>TUYỂN DỤNG</h2>
                        </div>
                        <div className={cx('recruitment-content')}>
                            <p className={cx('empty-recruitment')}>Không có tin tuyển dụng nào</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
