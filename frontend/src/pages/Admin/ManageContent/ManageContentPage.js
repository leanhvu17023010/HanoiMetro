import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageContentPage.module.scss';
import {
    getStoredToken,
    formatDateTime,
    normalizeMediaUrl,
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerMedia,
    getAllNews,
    createNews,
    updateNews,
    deleteNews,
    uploadNewsMedia
} from '../../../services';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const cx = classNames.bind(styles);

function ManageContentPage() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('banner');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'news' || tab === 'banner') {
            setActiveTab(tab);
        }
    }, [location.search]);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        description: '', // for banner
        summary: '',     // for news
        content: '',     // for news
        imageUrl: '',
        linkUrl: '',     // for banner
        status: true
    });

    const fetchContent = async () => {
        setLoading(true);
        try {
            const token = getStoredToken();
            let data;
            if (activeTab === 'banner') {
                data = await getAllBanners(token);
            } else {
                data = await getAllNews(token);
            }
            setItems(data || []);
        } catch (e) {
            console.error('Failed to fetch content', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [activeTab]);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            summary: '',
            content: '',
            imageUrl: '',
            linkUrl: '',
            status: true
        });
        setSelectedFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            summary: item.summary || '',
            content: item.content || '',
            imageUrl: item.imageUrl || '',
            linkUrl: item.linkUrl || '',
            status: item.status ?? true
        });
        setSelectedFile(null);
        setImagePreview(normalizeMediaUrl(item.imageUrl));
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa mục này?')) return;

        try {
            const token = getStoredToken();
            if (activeTab === 'banner') {
                await deleteBanner(id, token);
            } else {
                await deleteNews(id, token);
            }
            fetchContent();
        } catch (e) {
            alert('Xóa thất bại');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title?.trim()) {
            alert('Vui lòng nhập tiêu đề');
            return;
        }
        if (!selectedFile && !formData.imageUrl) {
            alert('Vui lòng upload ảnh hoặc nhập URL ảnh');
            return;
        }
        if (activeTab === 'news' && !formData.content?.trim()) {
            alert('Vui lòng nhập nội dung chi tiết');
            return;
        }

        setSubmitting(true);
        try {
            const token = getStoredToken();
            let res;

            if (activeTab === 'banner') {
                const payload = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    image: selectedFile,
                    linkUrl: formData.linkUrl.trim(),
                    status: formData.status
                };
                if (editingItem) {
                    res = await updateBanner(editingItem.id, payload, token);
                } else {
                    res = await createBanner(payload, token);
                }
            } else {
                const payload = {
                    title: formData.title.trim(),
                    summary: formData.summary.trim(),
                    content: formData.content.trim(),
                    image: selectedFile,
                    status: formData.status
                };
                if (editingItem) {
                    res = await updateNews(editingItem.id, payload, token);
                } else {
                    res = await createNews(payload, token);
                }
            }

            if (res && res.ok) {
                setShowModal(false);
                fetchContent();
                setEditingItem(null);
            } else {
                alert(`Lưu thất bại: ${res?.data?.message || 'Lỗi không xác định'}`);
            }
        } catch (e) {
            console.error('Submit error:', e);
            alert('Đã xảy ra lỗi trong quá trình lưu');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={cx('page')}>
            <h1 className={cx('title')}>Quản lý nội dung</h1>

            <div className={cx('tabs')}>
                <button className={cx('tab', { active: activeTab === 'banner' })} onClick={() => setActiveTab('banner')}>Banner/Slider</button>
                <button className={cx('tab', { active: activeTab === 'news' })} onClick={() => setActiveTab('news')}>Tin tức & Thông báo</button>
            </div>

            <div className={cx('header')}>
                <input className={cx('search')} placeholder="Tìm kiếm tiêu đề..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <button className={cx('add-btn')} onClick={handleOpenAddModal}>+ Thêm {activeTab === 'banner' ? 'Banner' : 'Tin tức'}</button>
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
                            {filteredItems.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr> : filteredItems.map((item, i) => (
                                <tr key={item.id || i}>
                                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                                    <td>
                                        {activeTab === 'banner' ? (
                                            <div className={cx('img-thumb')}><img src={normalizeMediaUrl(item.imageUrl)} alt="banner" /></div>
                                        ) : (
                                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.summary || '-'}
                                            </div>
                                        )}
                                    </td>
                                    <td>{formatDateTime(item.createdAt)}</td>
                                    <td><span className={cx('status-tag', item.status ? 'active' : 'inactive')}>{item.status ? 'Đang hiện' : 'Đang ẩn'}</span></td>
                                    <td>
                                        <button className={cx('action-btn')} onClick={() => handleOpenEditModal(item)}>Sửa</button>
                                        <button className={cx('action-btn', 'del')} onClick={() => handleDelete(item.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal')}>
                        <h2 className={cx('modal-title')}>
                            {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {activeTab === 'banner' ? 'Banner' : 'Tin tức'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className={cx('form-group')}>
                                <label>Tiêu đề</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {activeTab === 'banner' ? (
                                <>
                                    <div className={cx('form-group')}>
                                        <label>Mô tả</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Link liên kết (tùy chọn)</label>
                                        <input
                                            type="text"
                                            value={formData.linkUrl}
                                            onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={cx('form-group')}>
                                        <label>Tóm tắt</label>
                                        <textarea
                                            required
                                            value={formData.summary}
                                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                        />
                                    </div>
                                    <div className={cx('form-group', 'quill-editor')}>
                                        <label>Nội dung chi tiết</label>
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.content}
                                            onChange={(val) => setFormData({ ...formData, content: val })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className={cx('form-group')}>
                                <label>Hình ảnh</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                <div className={cx('image-preview')}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : (
                                        <span>Chưa có ảnh</span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('form-group')}>
                                <label>Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value === 'true' })}
                                >
                                    <option value="true">Hiển thị</option>
                                    <option value="false">Ẩn</option>
                                </select>
                            </div>

                            <div className={cx('modal-actions')}>
                                <button type="button" className={cx('cancel-btn')} onClick={() => setShowModal(false)} disabled={submitting}>Hủy</button>
                                <button type="submit" className={cx('save-btn')} disabled={submitting}>
                                    {submitting ? 'Đang lưu...' : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageContentPage;
