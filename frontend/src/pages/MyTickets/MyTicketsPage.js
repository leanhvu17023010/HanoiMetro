import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MyTicketsPage.module.scss';
import { getApiBaseUrl } from '../../services';

const cx = classNames.bind(styles);

const statusMap = {
    NEW: { label: 'Chờ xử lý', color: 'pending' },
    IN_PROGRESS: { label: 'Đang xử lý', color: 'progress' },
    RESOLVED: { label: 'Đã giải quyết', color: 'resolved' },
    ESCALATED: { label: 'Đang xử lý', color: 'progress' },
};

function MyTicketsPage() {
    const [email, setEmail] = useState('');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        setTickets([]);
        setSearched(false);
        try {
            const apiBaseUrl = getApiBaseUrl();
            const resp = await fetch(`${apiBaseUrl}/api/tickets/my?email=${encodeURIComponent(email.trim())}`);
            const data = await resp.json();
            const list = data?.result || [];
            setTickets(list);
            setSearched(true);
        } catch (err) {
            setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (str) => {
        if (!str) return '---';
        const d = new Date(str);
        return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('hero')}>
                <div className={cx('hero-overlay')} />
                <div className={cx('hero-content')}>
                    <h1>Tra cứu khiếu nại</h1>
                    <p>Nhập email bạn đã dùng khi gửi phản ánh để xem trạng thái xử lý</p>
                </div>
            </div>

            <div className={cx('container')}>
                <div className={cx('search-card')}>
                    <form onSubmit={handleSearch} className={cx('search-form')}>
                        <div className={cx('input-row')}>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Nhập địa chỉ email của bạn..."
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Đang tìm...' : 'Tra cứu'}
                            </button>
                        </div>
                    </form>
                </div>

                {error && <div className={cx('error-msg')}>{error}</div>}

                {searched && !loading && (
                    <div className={cx('results-container')}>
                        {tickets.length === 0 ? (
                            <div className={cx('empty-state')}>
                                <div className={cx('empty-icon')}>📭</div>
                                <h3>Không tìm thấy khiếu nại</h3>
                                <p>Không có khiếu nại nào được liên kết với email <strong>{email}</strong></p>
                            </div>
                        ) : (
                            <div>
                                <p className={cx('result-count')}>Tìm thấy <strong>{tickets.length}</strong> khiếu nại</p>
                                <div className={cx('ticket-list')}>
                                    {tickets.map(t => {
                                        const statusInfo = statusMap[t.status] || { label: t.status, color: 'pending' };
                                        const isExpanded = expandedId === t.id;
                                        return (
                                            <div key={t.id} className={cx('ticket-card', { expanded: isExpanded })}>
                                                <div className={cx('ticket-header')} onClick={() => setExpandedId(isExpanded ? null : t.id)}>
                                                    <div className={cx('ticket-meta')}>
                                                        <span className={cx('ticket-id')}>#{t.id.substring(0, 8).toUpperCase()}</span>
                                                        <span className={cx('ticket-date')}>{formatDate(t.createdAt)}</span>
                                                    </div>
                                                    <div className={cx('ticket-right')}>
                                                        <span className={cx('status-badge', statusInfo.color)}>{statusInfo.label}</span>
                                                        <span className={cx('chevron', { rotated: isExpanded })}>▾</span>
                                                    </div>
                                                </div>

                                                <div className={cx('ticket-preview')}>
                                                    <p>{t.content?.substring(0, 100)}{t.content?.length > 100 ? '...' : ''}</p>
                                                </div>

                                                {isExpanded && (
                                                    <div className={cx('ticket-detail')}>
                                                        <div className={cx('detail-section')}>
                                                            <h4>Nội dung khiếu nại của bạn</h4>
                                                            <div className={cx('content-box')}>{t.content}</div>
                                                        </div>

                                                        {t.status === 'RESOLVED' && t.handlerNote ? (
                                                            <div className={cx('response-section')}>
                                                                <h4>✅ Phản hồi từ bộ phận hỗ trợ</h4>
                                                                <div className={cx('response-box')}>{t.handlerNote}</div>
                                                                {t.updatedAt && (
                                                                    <p className={cx('response-date')}>Phản hồi lúc: {formatDate(t.updatedAt)}</p>
                                                                )}
                                                            </div>
                                                        ) : t.status !== 'RESOLVED' ? (
                                                            <div className={cx('pending-notice')}>
                                                                <span>⏳</span>
                                                                <p>Khiếu nại của bạn đang được xem xét. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTicketsPage;
