import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateCategoryPage.module.scss';
import { getCategoryById, updateCategory, getStoredToken } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

function UpdateCategoryPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: '', description: '', status: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = getStoredToken();
                const data = await getCategoryById(id, token);
                setFormData({ name: data.name, description: data.description || '', status: data.status });
            } catch (e) {
                setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể tải thông tin' });
            } finally { setLoading(false); }
        };
        fetchDetail();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = getStoredToken();
            await updateCategory(id, formData, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Cập nhật thành công' });
            setTimeout(() => navigate(`/admin/categories/${id}`), 1500);
        } catch (err) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể cập nhật' });
        } finally { setSaving(false); }
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Cập nhật Danh mục</h1>

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
                    <button type="submit" className={cx('btn', 'save')} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                </div>
            </form>

            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
        </div>
    );
}

export default UpdateCategoryPage;
