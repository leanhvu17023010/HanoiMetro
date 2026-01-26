import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageStaffAccountsPage.module.scss';
import SearchAndSort from '../../../components/Common/SearchAndSort';
import ConfirmDialog from '../../../components/Common/ConfirmDialog/DeleteAccountDialog';
import Notification from '../../../components/Common/Notification/Notification';
import { getAllUsers, updateUser, deleteUser } from '../../../services';

const cx = classNames.bind(styles);

function ManageStaffAccountsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('all');
    const [allEmployees, setAllEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
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

    const fetchStaff = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để tiếp tục');
                setLoading(false);
                return;
            }

            const users = await getAllUsers(token);
            const employees = (users || [])
                .filter(user => {
                    const roleName = user?.role?.name || user?.role;
                    return roleName === 'STAFF' || roleName === 'CUSTOMER_SUPPORT';
                })
                .map(user => {
                    const fullName = user.fullName || user.full_name || '';
                    const activeValue = user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true);

                    return {
                        id: user.id || user._id,
                        name: fullName || user.email?.split('@')[0] || 'N/A',
                        email: user.email || '',
                        phone: user.phoneNumber || user.phone_number || '',
                        status: activeValue ? 'active' : 'locked',
                        fullName: fullName,
                        role: user?.role?.name || user?.role || '',
                    };
                });

            setAllEmployees(employees);
            setFilteredEmployees(employees);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu nhân viên.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const staffSortOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'locked', label: 'Đã khóa' }
    ];

    const applyFilters = (search, status, data = allEmployees) => {
        let filtered = data;
        if (search && search.trim()) {
            const searchLower = search.toLowerCase().trim();
            filtered = filtered.filter(e =>
                e.fullName?.toLowerCase().includes(searchLower) ||
                e.name?.toLowerCase().includes(searchLower) ||
                e.email?.toLowerCase().includes(searchLower) ||
                e.phone?.includes(search.trim())
            );
        }
        if (status !== 'all') {
            filtered = filtered.filter(e => e.status === status);
        }
        setFilteredEmployees(filtered);
    };

    const handleToggleLock = (employeeId, currentStatus) => {
        const isCurrentlyActive = currentStatus === 'active';
        const action = isCurrentlyActive ? 'khóa' : 'mở khóa';

        setConfirmDialog({
            open: true,
            title: 'Xác nhận hành động',
            message: `Bạn có chắc chắn muốn ${action} tài khoản này?`,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    await updateUser(employeeId, { isActive: !isCurrentlyActive }, token);
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: `Đã ${action} thành công`, duration: 3000 });
                    fetchStaff();
                } catch (err) {
                    setNotif({ open: true, type: 'error', title: 'Thất bại', message: err.message });
                }
                setConfirmDialog(initialConfirmState);
            },
        });
    };

    return (
        <div className={cx('admin-page')}>
            <h1 className={cx('page-title')}>Quản lý tài khoản nhân viên</h1>

            <SearchAndSort
                searchPlaceholder="Tìm kiếm nhân viên..."
                searchValue={searchTerm}
                onSearchChange={(e) => {
                    setSearchTerm(e.target.value);
                    applyFilters(e.target.value, sortBy);
                }}
                sortOptions={staffSortOptions}
                sortValue={sortBy}
                onSortChange={(e) => {
                    setSortBy(e.target.value);
                    applyFilters(searchTerm, e.target.value);
                }}
                additionalButtons={[
                    { text: 'Thêm nhân viên', className: 'add-btn', onClick: () => navigate('/admin/add-employee') }
                ]}
            />

            {loading ? (
                <div className={cx('loading-container')}><p>Đang tải dữ liệu...</p></div>
            ) : (
                <div className={cx('table-container')}>
                    <table className={cx('data-table')}>
                        <thead>
                            <tr className={cx('table-header')}>
                                <th>Tên nhân viên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr>
                            ) : (
                                filteredEmployees.map((e) => (
                                    <tr key={e.id} className={cx('table-row')}>
                                        <td>{e.fullName || e.name}</td>
                                        <td>{e.email}</td>
                                        <td>{e.phone}</td>
                                        <td className={cx('status', e.status)}>
                                            {e.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                        </td>
                                        <td className={cx('actions')}>
                                            <button className={cx('btn', 'edit-btn')} onClick={() => navigate(`/admin/staff/${e.id}`)}>Sửa</button>
                                            <button className={cx('btn', e.status === 'active' ? 'lock-btn' : 'unlock-btn')} onClick={() => handleToggleLock(e.id, e.status)}>
                                                {e.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                            </button>
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

export default ManageStaffAccountsPage;
