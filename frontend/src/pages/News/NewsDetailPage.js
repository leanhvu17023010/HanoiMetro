import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NewsPage.module.scss';
import { getNewsById, formatDateTime, normalizeMediaUrl } from '../../services';

const cx = classNames.bind(styles);

function NewsDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const data = await getNewsById(id);
                setNews(data);
            } catch (error) {
                console.error('Failed to fetch news detail', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsDetail();
    }, [id]);

    if (loading) return <div className={cx('loading')}>Đang tải...</div>;
    if (!news) return <div className={cx('error')}>Không tìm thấy tin tức.</div>;

    return (
        <div className={cx('wrapper')}>
            <button className={cx('back-btn')} onClick={() => navigate('/news')}>
                &larr; Quay lại danh sách
            </button>

            <article className={cx('detail')}>
                <h1 className={cx('news-title')}>{news.title}</h1>
                <div className={cx('meta')}>
                    <span>Ngày đăng: {formatDateTime(news.createdAt)}</span>
                    {news.createdBy && <span> | Tác giả: {news.createdBy}</span>}
                </div>

                {news.imageUrl && (
                    <div className={cx('main-image')}>
                        <img src={normalizeMediaUrl(news.imageUrl)} alt={news.title} />
                    </div>
                )}

                <div className={cx('news-content')}>
                    {news.content?.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>
        </div>
    );
}

export default NewsDetailPage;
