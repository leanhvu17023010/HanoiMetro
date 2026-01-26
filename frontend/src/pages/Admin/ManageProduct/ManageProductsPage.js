import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageProductsPage.module.scss';
import SearchAndSort from '../../../components/Common/SearchAndSort';
import { getAllProducts, getActiveCategories, getStoredToken } from '../../../services';

const cx = classNames.bind(styles);

function ManageProductsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([{ value: 'all', label: 'Tất cả danh mục' }]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = getStoredToken();
            const list = await getAllProducts(token);
            const mapped = (list || []).map((p) => ({
                id: p.id || '',
                name: p.name || '',
                category: p.categoryName || '-',
                categoryId: p.categoryId || '',
                price: p.price || 0,
                status: p.status || 'Chờ duyệt',
                updatedAt: p.updatedAt || p.createdAt,
            }));
            setAllProducts(mapped);
            applyFilters(searchTerm, categoryFilter, statusFilter, mapped);
        } catch (e) {
            setError(e.message || 'Không thể tải danh sách Tuyến/Nhà ga');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const list = await getActiveCategories();
            const opts = [{ value: 'all', label: 'Tất cả danh mục' }].concat(
                list.map((c) => ({ value: c.id || c.categoryId, label: c.name })),
            );
            setCategories(opts);
        } catch (_) { }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const applyFilters = (search, category, status, data = allProducts) => {
        let filtered = data;
        if (search && search.trim()) {
            const s = search.toLowerCase().trim();
            filtered = filtered.filter(p => p.id.toLowerCase().includes(s) || p.name.toLowerCase().includes(s));
        }
        if (category !== 'all') {
            filtered = filtered.filter(p => String(p.categoryId) === String(category));
        }
        if (status !== 'all') {
            filtered = filtered.filter(p => p.status === status);
        }
        setFilteredProducts(filtered);
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className={cx('admin-page')}>
            <h1 className={cx('page-title')}>Quản lý Tuyến & Nhà ga</h1>

            <SearchAndSort
                searchPlaceholder="Tìm kiếm hành trình, tên tuyến..."
                searchValue={searchTerm}
                onSearchChange={(e) => {
                    setSearchTerm(e.target.value);
                    applyFilters(e.target.value, categoryFilter, statusFilter);
                }}
                filters={[
                    {
                        label: 'Danh mục:', options: categories, value: categoryFilter, onChange: (e) => {
                            setCategoryFilter(e.target.value);
                            applyFilters(searchTerm, e.target.value, statusFilter);
                        }
                    },
                    {
                        label: 'Trạng thái:', options: [
                            { value: 'all', label: 'Tất cả' },
                            { value: 'Chờ duyệt', label: 'Chờ duyệt' },
                            { value: 'Đã duyệt', label: 'Đã duyệt' },
                            { value: 'Từ chối', label: 'Từ chối' }
                        ], value: statusFilter, onChange: (e) => {
                            setStatusFilter(e.target.value);
                            applyFilters(searchTerm, categoryFilter, e.target.value);
                        }
                    }
                ]}
            />

            {loading ? (
                <div className={cx('loading')}>Đang tải...</div>
            ) : error ? (
                <div className={cx('error')}>{error}</div>
            ) : (
                <div className={cx('table-container')}>
                    <table className={cx('data-table')}>
                        <thead>
                            <tr className={cx('table-header')}>
                                <th>Mã Tuyến</th>
                                <th>Tên Tuyến/Nhà ga</th>
                                <th>Danh mục</th>
                                <th>Giá vé/Phí</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className={cx('table-row')}>
                                        <td>{p.id}</td>
                                        <td>{p.name}</td>
                                        <td>{p.category}</td>
                                        <td>{formatPrice(p.price)}</td>
                                        <td className={cx('status', p.status)}>{p.status}</td>
                                        <td>
                                            <button className={cx('btn', 'view-btn')} onClick={() => navigate(`/admin/products/${p.id}`)}>Xem chi tiết</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageProductsPage;
