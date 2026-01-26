import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ManageContentPage.module.scss';
import { getStoredToken, formatDateTime, normalizeMediaUrl } from '../../../services';

const cx = classNames.bind(styles);

function ManageContentPage() {
    const [activeTab, setActiveTab] = useState('banner');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchContent = async () => {
        setLoading(true);
        try {
            const token = getStoredToken();
            const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
            const base = apiBaseUrl || 'http://localhost:8080/metro/api/v1';

            const endpoint = activeTab === 'banner' ? '/banners' : '/news';
            const resp = await fetch(`${base}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            setItems(data?.result || data || []);
        } catch (e) {
            console.error('Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContent(); }, [activeTab]);

    return (
        <div className={cx('page')}>
            <h1 className={cx('title')}>Quản lý nội dung</h1>

            <div className={cx('tabs')}>
                <button className={cx('tab', { active: activeTab === 'banner' })} onClick={() => setActiveTab('banner')}>Banner/Slider</button>
                <button className={cx('tab', { active: activeTab === 'news' })} onClick={() => setActiveTab('news')}>Tin tức & Thông báo</button>
            </div>

            <div className={cx('header')}>
                <input className={cx('search')} placeholder="Tìm kiếm tiêu đề..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <button className={cx('add-btn')}>+ Thêm {activeTab === 'banner' ? 'Banner' : 'Tin tức'}</button>
            </div>

            {loading ? <div className={cx('status')}>Đang tải...</div> : (
                <div className={cx('table-wrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Tiêu đề</th>
                                <th>{activeTab === 'banner' ? 'Hình ảnh' : 'Tóm tắt'}</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr> : items.map((item, i) => (
                                <tr key={item.id || i}>
                                    <td>{item.title}</td>
                                    <td>
                                        {activeTab === 'banner' ? (
                                            <div className={cx('img-thumb')}><img src={normalizeMediaUrl(item.imageUrl)} alt="banner" /></div>
                                        ) : (
                                            item.summary || '-'
                                        )}
                                    </td>
                                    <td>{formatDateTime(item.createdAt)}</td>
                                    <td><span className={cx('status-tag', item.status ? 'active' : 'inactive')}>{item.status ? 'Đang hiện' : 'Đang ẩn'}</span></td>
                                    <td>
                                        <button className={cx('action-btn')}>Sửa</button>
                                        <button className={cx('action-btn', 'del')}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageContentPage;
