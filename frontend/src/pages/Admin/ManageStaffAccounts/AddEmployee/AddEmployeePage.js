import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AddEmployeePage.module.scss';
import { useAuth } from '../../../../contexts/AuthContext';
import { createStaff, getStoredToken } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

function AddEmployeePage() {
    const navigate = useNavigate();
    const { openLoginModal } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        roleName: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });

    const availableRoles = [
        { name: 'STAFF', description: 'Nhân viên' },
        { name: 'CUSTOMER_SUPPORT', description: 'Chăm sóc khách hàng' },
        { name: 'ADMIN', description: 'Quản trị viên' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (!formData.roleName) {
            newErrors.roleName = 'Vui lòng chọn vai trò';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.phoneNumber && !/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const token = getStoredToken();
                if (!token) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Hết hạn phiên đăng nhập' });
                    openLoginModal?.();
                    return;
                }

                const result = await createStaff(formData, token);

                if (result) {
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Tạo tài khoản nhân viên thành công!' });
                    setTimeout(() => navigate('/admin'), 1500);
                } else {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể tạo tài khoản. Vui lòng thử lại.' });
                }
            } catch (error) {
                console.error('Error creating staff:', error);
                setNotif({ open: true, type: 'error', title: 'Lỗi hệ thống', message: 'Có lỗi xảy ra khi kết nối máy chủ.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className={cx('add-employee-page')}>
            <div className={cx('page-header')}>
                <button className={cx('back-btn')} onClick={handleCancel}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className={cx('page-title')}>Thêm tài khoản nhân viên</h1>
            </div>

            <div className={cx('form-container')}>
                <div className={cx('form-card')}>
                    <div className={cx('form-content')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Họ và tên</label>
                            <input
                                type="text"
                                className={cx('form-input', { error: errors.fullName })}
                                placeholder="Nhập họ tên nhân viên"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                            />
                            {errors.fullName && <span className={cx('error-message')}>{errors.fullName}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Vai trò</label>
                            <select
                                className={cx('form-select', { error: errors.roleName })}
                                value={formData.roleName}
                                onChange={(e) => handleInputChange('roleName', e.target.value)}
                            >
                                <option value="">-- Chọn vai trò --</option>
                                {availableRoles.map((role) => (
                                    <option key={role.name} value={role.name}>
                                        {role.description}
                                    </option>
                                ))}
                            </select>
                            {errors.roleName && <span className={cx('error-message')}>{errors.roleName}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Email</label>
                            <input
                                type="email"
                                className={cx('form-input', { error: errors.email })}
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                            {errors.email && <span className={cx('error-message')}>{errors.email}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Số điện thoại</label>
                            <input
                                type="tel"
                                className={cx('form-input', { error: errors.phoneNumber })}
                                placeholder="Nhập số điện thoại (không bắt buộc)"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                            {errors.phoneNumber && <span className={cx('error-message')}>{errors.phoneNumber}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Địa chỉ</label>
                            <input
                                type="text"
                                className={cx('form-input', { error: errors.address })}
                                placeholder="Nhập địa chỉ (không bắt buộc)"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                            {errors.address && <span className={cx('error-message')}>{errors.address}</span>}
                        </div>
                    </div>

                    <div className={cx('form-footer')}>
                        <button className={cx('btn', 'cancel-btn')} onClick={handleCancel}>
                            Hủy
                        </button>
                        <button
                            className={cx('btn', 'save-btn')}
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang tạo...' : 'Tạo tài khoản nhân viên'}
                        </button>
                    </div>
                </div>
            </div>
            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
        </div>
    );
}

export default AddEmployeePage;
