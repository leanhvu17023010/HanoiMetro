import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AddCategoryPage.module.scss';
import { createCategory, getStoredToken } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

function AddCategoryPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', description: '', status: true });
    const [saving, setSaving] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = getStoredToken();
            await createCategory(formData, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã tạo danh mục mới' });
            setTimeout(() => navigate('/admin/categories'), 1500);
        } catch (err) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể tạo danh mục' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Thêm Danh mục mới</h1>

            <form className={cx('form-card')} onSubmit={handleSubmit}>
                <div className={cx('group')}>
                    <label>Tên danh mục:</label>
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className={cx('group')}>
                    <label>Mô tả:</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />
                </div>
                <div className={cx('group', 'row')}>
                    <label>Hiện thị:</label>
                    <input type="checkbox" checked={formData.status} onChange={e => setFormData({ ...formData, status: e.target.checked })} />
                </div>

                <div className={cx('actions')}>
                    <button type="button" className={cx('btn', 'cancel')} onClick={() => navigate(-1)}>Hủy</button>
                    <button type="submit" className={cx('btn', 'save')} disabled={saving}>{saving ? 'Đang lưu...' : 'Thêm danh mục'}</button>
                </div>
            </form>

            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
        </div>
    );
}

export default AddCategoryPage;
