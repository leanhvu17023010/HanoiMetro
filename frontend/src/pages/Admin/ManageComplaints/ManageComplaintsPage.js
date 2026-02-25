import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageComplaintsPage.module.scss';
import SearchAndSort from '../../../components/Common/SearchAndSort';
import { getStoredToken, formatDateTime, getApiBaseUrl } from '../../../services';

const cx = classNames.bind(styles);

const statusMap = {
    NEW: 'Chờ xử lý',
    RESOLVED: 'Đã giải quyết',
};

function ManageComplaintsPage() {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const token = getStoredToken();
            const apiBaseUrl = getApiBaseUrl();
            const resp = await fetch(`${apiBaseUrl}/api/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            const list = data?.result || [];
            setComplaints(list);
            applyFilters(searchTerm, statusFilter, list);
        } catch (err) {
            setError('Không thể tải danh sách khiếu nại');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const applyFilters = (search, status, data = complaints) => {
        let filtered = data;
        if (search.trim()) {
            const s = search.toLowerCase();
            filtered = filtered.filter(c => (c.customerName || '').toLowerCase().includes(s) || (c.content || '').toLowerCase().includes(s));
        }
        if (status !== 'all') {
            filtered = filtered.filter(c => statusMap[c.status] === status);
        }
        setFilteredComplaints(filtered);
    };

    return (
        <div className={cx('admin-page')}>
            <h1 className={cx('page-title')}>Quản lý Khiếu nại & Phản hồi</h1>

            <SearchAndSort
                searchPlaceholder="Tìm kiếm theo tên, nội dung..."
                searchValue={searchTerm}
                onSearchChange={e => { setSearchTerm(e.target.value); applyFilters(e.target.value, statusFilter); }}
                sortOptions={[{ value: 'all', label: 'Tất cả trạng thái' }, { value: 'NEW', label: 'Chờ xử lý' }, { value: 'RESOLVED', label: 'Đã giải quyết' }]}
                sortValue={statusFilter}
                onSortChange={e => { setStatusFilter(e.target.value); applyFilters(searchTerm, e.target.value); }}
            />

            {loading ? <div className={cx('status')}>Đang tải...</div> : error ? <div className={cx('status', 'error')}>{error}</div> : (
                <div className={cx('table-container')}>
                    <table className={cx('complaint-table')}>
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Khách hàng</th>
                                <th>Nội dung</th>
                                <th>Ngày gửi</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr> : filteredComplaints.map(c => (
                                <tr key={c.id}>
                                    <td>#{c.id.substring(0, 6).toUpperCase()}</td>
                                    <td>{c.customerName}</td>
                                    <td className={cx('content-cell')}>{c.content}</td>
                                    <td>{formatDateTime(c.createdAt)}</td>
                                    <td><span className={cx('status-tag', c.status.toLowerCase())}>{statusMap[c.status]}</span></td>
                                    <td><button className={cx('view-btn')} onClick={() => navigate(`/admin/complaints/${c.id}`)}>Xem</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageComplaintsPage;
