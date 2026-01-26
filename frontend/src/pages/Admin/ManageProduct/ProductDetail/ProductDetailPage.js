import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductDetailPage.module.scss';
import { getProductById, getStoredToken, approveProduct, deleteUser } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';
import ConfirmDialog from '../../../../components/Common/ConfirmDialog/DeleteAccountDialog';

const cx = classNames.bind(styles);

function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });
    const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null });

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const token = getStoredToken();
            const data = await getProductById(id, token);
            setProduct(data);
        } catch (e) {
            setError(e.message || 'Không thể tải thông tin Tuyến/Nhà ga');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleApprove = async () => {
        setConfirm({
            open: true,
            title: 'Xác nhận duyệt',
            message: 'Bạn có chắc chắn muốn duyệt Tuyến/Nhà ga này?',
            onConfirm: async () => {
                setProcessing(true);
                try {
                    const token = getStoredToken();
                    await approveProduct({ productId: id, action: 'APPROVE' }, token);
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã duyệt thành công' });
                    fetchProduct();
                } catch (e) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
                } finally {
                    setProcessing(false);
                    setConfirm({ open: false });
                }
            }
        });
    };

    const handleDelete = async () => {
        setConfirm({
            open: true,
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa Tuyến/Nhà ga này?',
            onConfirm: async () => {
                setProcessing(true);
                try {
                    const token = getStoredToken();
                    // Using deleteProduct endpoint if it exists, otherwise assuming deleteUser logic is generic for IDs if mapped
                    const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
                    const url = `${apiBaseUrl || 'http://localhost:8080/metro/api/v1'}/products/${id}`;
                    const resp = await fetch(url, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (resp.ok) {
                        setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã xóa thành công' });
                        navigate('/admin/products');
                    } else throw new Error('Xóa thất bại');
                } catch (e) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: e.message });
                } finally {
                    setProcessing(false);
                    setConfirm({ open: false });
                }
            }
        });
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (error || !product) return <div className={cx('page')}><button onClick={() => navigate(-1)}>←</button><p>{error || 'Không tìm thấy'}</p></div>;

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết Tuyến / Nhà ga</h1>

            <div className={cx('card')}>
                <div className={cx('info-grid')}>
                    <div className={cx('row')}><span className={cx('label')}>Mã:</span><span>{product.id}</span></div>
                    <div className={cx('row')}><span className={cx('label')}>Tên Tuyến:</span><span className={cx('name')}>{product.name}</span></div>
                    <div className={cx('row')}><span className={cx('label')}>Danh mục:</span><span>{product.categoryName}</span></div>
                    <div className={cx('row')}><span className={cx('label')}>Giá vé dự kiến:</span><span>{formatPrice(product.price)}</span></div>
                    <div className={cx('row')}><span className={cx('label')}>Mô tả:</span><p>{product.description || 'Chưa có mô tả'}</p></div>
                    <div className={cx('row')}><span className={cx('label')}>Trạng thái:</span><span className={cx('status', product.status)}>{product.status}</span></div>
                </div>

                <div className={cx('actions')}>
                    {product.status === 'Chờ duyệt' && (
                        <button className={cx('btn', 'approve')} onClick={handleApprove} disabled={processing}>Duyệt</button>
                    )}
                    <button className={cx('btn', 'edit')} onClick={() => navigate(`/admin/products/${id}/update`)}>Chỉnh sửa</button>
                    <button className={cx('btn', 'delete')} onClick={handleDelete} disabled={processing}>Xóa</button>
                </div>
            </div>

            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
            <ConfirmDialog {...confirm} onCancel={() => setConfirm({ ...confirm, open: false })} />
        </div>
    );
}

export default ProductDetailPage;
