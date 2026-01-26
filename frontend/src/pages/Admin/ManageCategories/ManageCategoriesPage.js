import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageCategoriesPage.module.scss';
import SearchAndSort from '../../../components/Common/SearchAndSort';
import { getAllCategories, getStoredToken, deleteCategory, updateCategory, getCategoryById } from '../../../services';
import Notification from '../../../components/Common/Notification/Notification';
import ConfirmDialog from '../../../components/Common/ConfirmDialog/DeleteAccountDialog';

const cx = classNames.bind(styles);

function ManageCategoriesPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('all');
    const [allCategories, setAllCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });
    const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = getStoredToken();
            const list = await getAllCategories(token);
            setAllCategories(list || []);
            applyFilters(searchTerm, sortBy, list || []);
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể tải danh mục' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const applyFilters = (search, status, data = allCategories) => {
        let filtered = data;
        if (search.trim()) {
            const s = search.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s));
        }
        if (status !== 'all') {
            const isActive = status === 'active';
            filtered = filtered.filter(c => c.status === isActive);
        }
        setFilteredCategories(filtered);
    };

    const handleDelete = (cat) => {
        setConfirm({
            open: true,
            title: 'Xác nhận xóa',
            message: `Xóa danh mục "${cat.name}"?`,
            onConfirm: async () => {
                try {
                    const token = getStoredToken();
                    await deleteCategory(cat.id, token);
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã xóa' });
                    fetchCategories();
                } catch (e) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể xóa' });
                } finally { setConfirm({ open: false }); }
            }
        });
    };

    return (
        <div className={cx('admin-page')}>
            <h1 className={cx('page-title')}>Quản lý Danh mục & Loại vé</h1>

            <SearchAndSort
                searchPlaceholder="Tìm kiếm danh mục..."
                searchValue={searchTerm}
                onSearchChange={e => { setSearchTerm(e.target.value); applyFilters(e.target.value, sortBy); }}
                sortOptions={[{ value: 'all', label: 'Tất cả' }, { value: 'active', label: 'Hoạt động' }, { value: 'locked', label: 'Đã ẩn' }]}
                sortValue={sortBy}
                onSortChange={e => { setSortBy(e.target.value); applyFilters(searchTerm, e.target.value); }}
                additionalButtons={[{ text: 'Thêm danh mục', className: 'add-btn', onClick: () => navigate('/admin/categories/new') }]}
            />

            {loading ? <div className={cx('status')}>Đang tải...</div> : (
                <div className={cx('table-container')}>
                    <table className={cx('data-table')}>
                        <thead>
                            <tr className={cx('table-header')}>
                                <th>Mã</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr> : filteredCategories.map(c => (
                                <tr key={c.id} className={cx('table-row')}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>{c.description || '-'}</td>
                                    <td><span className={cx('badge', c.status ? 'active' : 'locked')}>{c.status ? 'Hiện' : 'Ẩn'}</span></td>
                                    <td className={cx('actions')}>
                                        <button className={cx('btn', 'edit-btn')} onClick={() => navigate(`/admin/categories/${c.id}`)}>Chi tiết</button>
                                        <button className={cx('btn', 'delete-btn')} onClick={() => handleDelete(c)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
            <ConfirmDialog {...confirm} onCancel={() => setConfirm({ ...confirm, open: false })} />
        </div>
    );
}

export default ManageCategoriesPage;
