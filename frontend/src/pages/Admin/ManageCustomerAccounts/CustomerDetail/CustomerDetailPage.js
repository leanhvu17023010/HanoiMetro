import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerDetailPage.module.scss';
import guestAvatar from '../../../../assets/icons/icon_img_guest.png';
import Notification from '../../../../components/Common/Notification/Notification';
import ConfirmDialog from '../../../../components/Common/ConfirmDialog/DeleteAccountDialog';
import { getUserById, getStoredToken, updateUser, deleteUser } from '../../../../services';

const cx = classNames.bind(styles);

function CustomerDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', address: '' });
    const [saving, setSaving] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '', duration: 3000 });
    const initialConfirmState = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
    };
    const [confirmDialog, setConfirmDialog] = useState(initialConfirmState);

    const fetchCustomer = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getStoredToken();
            if (!token) {
                setError('Vui lòng đăng nhập để tiếp tục');
                setLoading(false);
                return;
            }

            const result = await getUserById(id, token);
            setCustomer(result);
            if (result) {
                setFormData({
                    fullName: result.fullName || '',
                    phoneNumber: result.phoneNumber || '',
                    address: result.address || '',
                });
            }
        } catch (e) {
            setError(e.message || 'Không thể tải thông tin khách hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const resolveActive = (c) => {
        if (!c) return false;
        return c.isActive !== undefined ? c.isActive : (c.active !== undefined ? c.active : true);
    };

    const handleToggleLock = () => {
        if (!customer) return;
        const isCurrentlyActive = resolveActive(customer);
        const action = isCurrentlyActive ? 'khóa' : 'mở khóa';
        setConfirmDialog({
            open: true,
            title: 'Xác nhận hành động',
            message: `Bạn có chắc chắn muốn ${action} tài khoản này?`,
            onConfirm: async () => {
                try {
                    const token = getStoredToken();
                    const next = await updateUser(customer.id, { isActive: !isCurrentlyActive }, token);
                    setCustomer(next || { ...customer, isActive: !isCurrentlyActive });
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: `Đã ${action} tài khoản thành công` });
                } catch (e) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
                }
                setConfirmDialog(initialConfirmState);
            },
        });
    };

    const handleDelete = () => {
        if (!customer) return;
        setConfirmDialog({
            open: true,
            title: 'Xác nhận xóa tài khoản',
            message: 'Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.',
            onConfirm: async () => {
                try {
                    const token = getStoredToken();
                    await deleteUser(customer.id, token);
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã xóa tài khoản thành công' });
                    navigate('/admin/customer-accounts');
                } catch (e) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
                }
                setConfirmDialog(initialConfirmState);
            },
        });
    };

    const handleSaveChanges = async () => {
        if (!customer) return;
        setSaving(true);
        try {
            const token = getStoredToken();
            const updated = await updateUser(customer.id, formData, token);
            setCustomer(updated || { ...customer, ...formData });
            setIsEditing(false);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã cập nhật thông tin khách hàng' });
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={cx('page')}><p>Đang tải dữ liệu...</p></div>;
    if (error) return <div className={cx('page')}><button onClick={handleBack}>←</button><p>{error}</p></div>;
    if (!customer) return null;

    const isActiveResolved = resolveActive(customer);

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={handleBack}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết thông tin khách hàng</h1>

            <div className={cx('card')}>
                <div className={cx('avatar-col')}>
                    <img className={cx('avatar')} src={customer.avatarUrl || guestAvatar} alt="avatar" />
                </div>

                <div className={cx('info-col')}>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Mã KH:</span>
                        <span className={cx('value')}>{customer.id}</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Họ tên:</span>
                        {isEditing ? (
                            <input
                                className={cx('input')}
                                value={formData.fullName}
                                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                            />
                        ) : (
                            <span className={cx('value')}>{customer.fullName || 'N/A'}</span>
                        )}
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Email:</span>
                        <span className={cx('value')}>{customer.email}</span>
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Số điện thoại:</span>
                        {isEditing ? (
                            <input
                                className={cx('input')}
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                            />
                        ) : (
                            <span className={cx('value')}>{customer.phoneNumber || 'N/A'}</span>
                        )}
                    </div>
                    <div className={cx('info-row')}>
                        <span className={cx('label')}>Trạng thái:</span>
                        <span className={cx('badge', isActiveResolved ? 'active' : 'locked')}>
                            {isActiveResolved ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </div>

                    <div className={cx('actions')}>
                        {isEditing ? (
                            <>
                                <button className={cx('btn', 'cancel')} onClick={() => setIsEditing(false)}>Hủy</button>
                                <button className={cx('btn', 'save')} onClick={handleSaveChanges} disabled={saving}>Lưu</button>
                            </>
                        ) : (
                            <>
                                <button className={cx('btn', 'edit')} onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                                <button className={cx('btn', 'toggle')} onClick={handleToggleLock}>{isActiveResolved ? 'Khóa' : 'Mở khóa'}</button>
                                <button className={cx('btn', 'delete')} onClick={handleDelete}>Xóa</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Notification
                open={notif.open}
                type={notif.type}
                title={notif.title}
                message={notif.message}
                duration={notif.duration}
                onClose={() => setNotif((prev) => ({ ...prev, open: false }))}
            />
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm || (() => { })}
                onCancel={() => setConfirmDialog(initialConfirmState)}
            />
        </div>
    );
}

export default CustomerDetailPage;
