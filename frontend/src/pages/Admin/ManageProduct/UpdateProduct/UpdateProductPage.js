import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateProductPage.module.scss';
import { getProductById, getStoredToken, updateProduct, getActiveCategories } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

function UpdateProductPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: '', categoryId: '', price: '', description: '' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getStoredToken();
                const [productData, cats] = await Promise.all([
                    getProductById(id, token),
                    getActiveCategories()
                ]);
                setFormData({
                    name: productData.name || '',
                    categoryId: productData.categoryId || '',
                    price: productData.price || '',
                    description: productData.description || ''
                });
                setCategories(cats);
            } catch (e) {
                setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = getStoredToken();
            await updateProduct(id, formData, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Cập nhật thành công' });
            setTimeout(() => navigate(`/admin/products/${id}`), 1500);
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Cập nhật Tuyến / Nhà ga</h1>

            <form className={cx('form-card')} onSubmit={handleSubmit}>
                <div className={cx('group')}>
                    <label>Tên Tuyến/Nhà ga:</label>
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className={cx('group')}>
                    <label>Danh mục:</label>
                    <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                        <option value="">Chọn danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className={cx('group')}>
                    <label>Giá vé dự kiến:</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className={cx('group')}>
                    <label>Mô tả:</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={5} />
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

export default UpdateProductPage;
