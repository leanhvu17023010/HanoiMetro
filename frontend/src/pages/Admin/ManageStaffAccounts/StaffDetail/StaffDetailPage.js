import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './StaffDetailPage.module.scss';
import guestAvatar from '../../../../assets/icons/icon_img_guest.png';
import ConfirmDialog from '../../../../components/Common/ConfirmDialog/DeleteAccountDialog';
import Notification from '../../../../components/Common/Notification/Notification';
import { getUserById, updateUser, getStoredToken } from '../../../../services';

const cx = classNames.bind(styles);

function StaffDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: null,
    });
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '', duration: 3000 });

    const fetchStaff = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getStoredToken();
            if (!token) {
                setError('Vui lòng đăng nhập để tiếp tục');
                setLoading(false);
                return;
            }

            const staffData = await getUserById(id, token) || null;
            setStaff(staffData);
        } catch (e) {
            setError(e.message || 'Không thể tải thông tin nhân viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const resolveActive = (s) => {
        if (!s) return false;
        return s.isActive !== undefined ? s.isActive : (s.active !== undefined ? s.active : true);
    };

    const getRoleDisplayName = (roleName) => {
        if (roleName === 'STAFF') return 'Nhân viên';
        if (roleName === 'CUSTOMER_SUPPORT') return 'Chăm sóc khách hàng';
        if (roleName === 'ADMIN') return 'Quản trị viên';
        return roleName || 'Nhân viên';
    };

    const getRoleValue = (displayName) => {
        if (displayName === 'Nhân viên') return 'STAFF';
        if (displayName === 'Chăm sóc khách hàng') return 'CUSTOMER_SUPPORT';
        if (displayName === 'Quản trị viên') return 'ADMIN';
        return 'STAFF';
    };

    const handleSave = async () => {
        if (!staff) return;
        setSaving(true);
        try {
            const token = getStoredToken();
            if (!token) {
                setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Hết hạn phiên đăng nhập' });
                return;
            }

            const requestBody = {
                fullName: staff.fullName || '',
                phoneNumber: staff.phoneNumber || '',
                role: getRoleValue(staff.roleDisplay || staff.role?.name || 'STAFF'),
                isActive: resolveActive(staff),
            };

            await updateUser(staff.id, requestBody, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã lưu thay đổi thành công' });
            fetchStaff();
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message || 'Không thể lưu thay đổi' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleLock = () => {
        if (!staff) return;
        const isCurrentlyActive = resolveActive(staff);
        const action = isCurrentlyActive ? 'khóa' : 'mở khóa';

        setConfirmDialog({
            open: true,
            title: 'Xác nhận hành động',
            message: `Bạn có chắc chắn muốn ${action} tài khoản này?`,
            onConfirm: () => performToggleLock(),
        });
    };

    const performToggleLock = async () => {
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        if (!staff) return;

        const isCurrentlyActive = resolveActive(staff);
        const action = isCurrentlyActive ? 'khóa' : 'mở khóa';

        try {
            const token = getStoredToken();
            await updateUser(staff.id, { isActive: !isCurrentlyActive }, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: `Đã ${action} tài khoản thành công` });
            fetchStaff();
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
        }
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (error) return <div className={cx('page')}><button onClick={handleBack}>←</button><p className={cx('error')}>{error}</p></div>;
    if (!staff) return null;

    const isActiveResolved = resolveActive(staff);
    const roleDisplayName = getRoleDisplayName(staff.roleDisplay || staff.role?.name);

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={handleBack}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết nhân viên</h1>

            <div className={cx('card')}>
                <div className={cx('profile-section')}>
                    <div className={cx('avatar-wrapper')}>
                        <img className={cx('avatar')} src={staff.avatarUrl || guestAvatar} alt="avatar" />
                    </div>
                    <div className={cx('profile-info')}>
                        <h2 className={cx('staff-name')}>{staff.fullName || staff.email || 'N/A'}</h2>
                        <p className={cx('staff-id')}>Mã: {staff.id}</p>
                        <p className={cx('staff-status', isActiveResolved ? 'active' : 'locked')}>
                            Trạng thái: {isActiveResolved ? 'Hoạt động' : 'Đã khóa'}
                        </p>
                    </div>
                </div>

                <div className={cx('form-grid')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Họ và tên:</label>
                        <input type="text" className={cx('form-input')} value={staff.fullName || ''} onChange={(e) => setStaff({ ...staff, fullName: e.target.value })} />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Email:</label>
                        <input type="email" className={cx('form-input')} value={staff.email || ''} readOnly disabled />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Số điện thoại:</label>
                        <input type="text" className={cx('form-input')} value={staff.phoneNumber || ''} onChange={(e) => setStaff({ ...staff, phoneNumber: e.target.value })} />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Chức vụ:</label>
                        <select
                            className={cx('form-select')}
                            value={roleDisplayName}
                            onChange={(e) => setStaff({ ...staff, roleDisplay: e.target.value })}
                        >
                            <option value="Nhân viên">Nhân viên</option>
                            <option value="Chăm sóc khách hàng">Chăm sóc khách hàng</option>
                            <option value="Quản trị viên">Quản trị viên</option>
                        </select>
                    </div>
                </div>

                <div className={cx('actions')}>
                    <button className={cx('btn', 'save-btn')} onClick={handleSave} disabled={saving}>
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button className={cx('btn', 'lock-btn')} onClick={handleToggleLock}>
                        {isActiveResolved ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    </button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm || (() => { })}
                onCancel={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
            />
            <Notification {...notif} onClose={() => setNotif((n) => ({ ...n, open: false }))} />
        </div>
    );
}

export default StaffDetailPage;
