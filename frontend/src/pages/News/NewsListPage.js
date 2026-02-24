import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NewsPage.module.scss';
import { getActiveNews, formatDateTime, normalizeMediaUrl } from '../../services';

const cx = classNames.bind(styles);

function NewsListPage() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getActiveNews();
                setNewsList(data || []);
            } catch (error) {
                console.error('Failed to fetch news', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <div className={cx('loading')}>Đang tải tin tức...</div>;

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Tin tức & Thông báo</h1>

            <div className={cx('news-grid')}>
                {newsList.length === 0 ? (
                    <div className={cx('no-data')}>Hiện chưa có tin tức nào.</div>
                ) : (
                    newsList.map((news) => (
                        <div
                            key={news.id}
                            className={cx('news-card')}
                            onClick={() => navigate(`/news/${news.id}`)}
                        >
                            <div className={cx('image-wrap')}>
                                <img src={normalizeMediaUrl(news.imageUrl)} alt={news.title} />
                            </div>
                            <div className={cx('content')}>
                                <h2 className={cx('news-title')}>{news.title}</h2>
                                <p className={cx('summary')}>{news.summary}</p>
                                <span className={cx('date')}>{formatDateTime(news.createdAt)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NewsListPage;
