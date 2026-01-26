import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageCustomerAccountsPage.module.scss';
import SearchAndSort from '../../../components/Common/SearchAndSort';
import ConfirmDialog from '../../../components/Common/ConfirmDialog/DeleteAccountDialog';
import Notification from '../../../components/Common/Notification/Notification';
import { getAllUsers, updateUser, deleteUser, getStoredToken } from '../../../services';

const cx = classNames.bind(styles);

function ManageCustomerAccountsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('all');
    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const initialConfirmState = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
    };
    const [confirmDialog, setConfirmDialog] = useState(initialConfirmState);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '', duration: 3000 });

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getStoredToken();
            if (!token) {
                setError('Vui lòng đăng nhập để tiếp tục');
                setLoading(false);
                return;
            }

            const users = await getAllUsers(token);
            const customers = (users || [])
                .filter(user => (user?.role?.name || user?.role) === 'CUSTOMER')
                .map(user => {
                    const fullName = user.fullName || user.full_name || '';
                    const activeValue = user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true);

                    return {
                        id: user.id || user._id,
                        username: user.email?.split('@')[0] || fullName || 'N/A',
                        email: user.email || '',
                        phone: user.phoneNumber || user.phone_number || '',
                        status: activeValue ? 'active' : 'locked',
                        fullName: fullName,
                    };
                });

            setAllCustomers(customers);
            setFilteredCustomers(customers);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu khách hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const customerSortOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'locked', label: 'Đã khóa' }
    ];

    const applyFilters = (search, status, data = allCustomers) => {
        let filtered = data;
        if (search && search.trim()) {
            const searchLower = search.toLowerCase().trim();
            filtered = filtered.filter(customer =>
                (customer.fullName || '').toLowerCase().includes(searchLower) ||
                (customer.username || '').toLowerCase().includes(searchLower) ||
                (customer.email || '').toLowerCase().includes(searchLower) ||
                (customer.phone || '').includes(search.trim())
            );
        }
        if (status !== 'all') {
            filtered = filtered.filter(customer => customer.status === status);
        }
        setFilteredCustomers(filtered);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        applyFilters(val, sortBy);
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSortBy(val);
        applyFilters(searchTerm, val);
    };

    const handleToggleLock = (customerId, currentStatus) => {
        const isCurrentlyActive = currentStatus === 'active';
        const action = isCurrentlyActive ? 'khóa' : 'mở khóa';

        setConfirmDialog({
            open: true,
            title: 'Xác nhận hành động',
            message: `Bạn có chắc chắn muốn ${action} tài khoản này?`,
            onConfirm: async () => {
                try {
                    const token = getStoredToken();
                    await updateUser(customerId, { isActive: !isCurrentlyActive }, token);
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: `Đã ${action} thành công`, duration: 3000 });
                    fetchCustomers();
                } catch (err) {
                    setNotif({ open: true, type: 'error', title: 'Thất bại', message: err.message });
                }
                setConfirmDialog(initialConfirmState);
            },
        });
    };

    const handleViewDetails = (customerId) => {
        navigate(`/admin/customers/${customerId}`);
    };

    return (
        <div className={cx('admin-page')}>
            <h1 className={cx('page-title')}>Quản lý tài khoản khách hàng</h1>

            <SearchAndSort
                searchPlaceholder="Tìm kiếm khách hàng..."
                searchValue={searchTerm}
                onSearchChange={handleSearchChange}
                sortOptions={customerSortOptions}
                sortValue={sortBy}
                onSortChange={handleSortChange}
            />

            {loading ? (
                <div className={cx('loading-container')}><p>Đang tải dữ liệu...</p></div>
            ) : error ? (
                <div className={cx('error-container')}>
                    <p>{error}</p>
                    <button onClick={fetchCustomers}>Tải lại</button>
                </div>
            ) : (
                <div className={cx('table-container')}>
                    <table className={cx('data-table')}>
                        <thead>
                            <tr className={cx('table-header')}>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className={cx('table-row')}>
                                        <td>{customer.fullName || customer.username}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td className={cx('status', customer.status)}>
                                            {customer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                        </td>
                                        <td className={cx('actions')}>
                                            <button className={cx('btn', 'edit-btn')} onClick={() => handleViewDetails(customer.id)}>Sửa</button>
                                            <button className={cx('btn', customer.status === 'active' ? 'lock-btn' : 'unlock-btn')} onClick={() => handleToggleLock(customer.id, customer.status)}>
                                                {customer.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                            </button>
                                        </td>
                                        <td>
                                            <button className={cx('btn', 'detail-btn')} onClick={() => handleViewDetails(customer.id)}>Xem chi tiết</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm || (() => { })}
                onCancel={() => setConfirmDialog(initialConfirmState)}
            />
            <Notification
                open={notif.open}
                type={notif.type}
                title={notif.title}
                message={notif.message}
                duration={notif.duration}
                onClose={() => setNotif((n) => ({ ...n, open: false }))}
            />
        </div>
    );
}

export default ManageCustomerAccountsPage;
