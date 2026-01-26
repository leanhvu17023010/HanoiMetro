import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageOrderDetailPage.module.scss';
import { getStoredToken, formatDateTime } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';
import ConfirmDialog from '../../../../components/Common/ConfirmDialog/DeleteAccountDialog';

const cx = classNames.bind(styles);

function ManageOrderDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });
    const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null });

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const token = getStoredToken();
            const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
            const resp = await fetch(`${apiBaseUrl || 'http://localhost:8080/metro/api/v1'}/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            setOrder(data?.result || data);
        } catch (err) {
            setError('Không thể tải chi tiết đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDetail(); }, [id]);

    const handleConfirmRefund = () => {
        setConfirm({
            open: true,
            title: 'Xác nhận hoàn tiền',
            message: 'Bạn có chắc chắn muốn hoàn tiền cho đơn hàng này?',
            onConfirm: async () => {
                try {
                    const token = getStoredToken();
                    const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
                    await fetch(`${apiBaseUrl || 'http://localhost:8080/metro/api/v1'}/orders/${id}/confirm-refund`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã hoàn tiền thành công' });
                    fetchDetail();
                } catch (e) {
                    setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Hoàn tiền thất bại' });
                } finally {
                    setConfirm({ open: false });
                }
            }
        });
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (error || !order) return <div className={cx('page')}><button onClick={() => navigate(-1)}>←</button><p>{error || 'Không tìm thấy'}</p></div>;

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết Đơn hàng / Vé</h1>

            <div className={cx('card')}>
                <div className={cx('section')}>
                    <h3>Thông tin khách hàng</h3>
                    <p><strong>Họ tên:</strong> {order.customerName || order.userFullName}</p>
                    <p><strong>Email:</strong> {order.customerEmail || order.userEmail}</p>
                    <p><strong>SĐT:</strong> {order.customerPhone || 'N/A'}</p>
                </div>

                <div className={cx('section')}>
                    <h3>Chi tiết giao dịch</h3>
                    <p><strong>Mã đơn:</strong> #{order.code || order.id}</p>
                    <p><strong>Ngày đặt:</strong> {formatDateTime(order.createdAt)}</p>
                    <p><strong>Trạng thái:</strong> {order.status}</p>
                    <p><strong>Tổng tiền:</strong> {formatPrice(order.totalAmount)}</p>
                </div>

                <div className={cx('section')}>
                    <h3>Danh sách sản phẩm/vế</h3>
                    <table className={cx('items-table')}>
                        <thead>
                            <tr><th>Tên</th><th>SL</th><th>Giá</th><th>Tổng</th></tr>
                        </thead>
                        <tbody>
                            {(order.items || []).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.productName || item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatPrice(item.unitPrice || item.price)}</td>
                                    <td>{formatPrice(item.totalPrice || (item.quantity * (item.unitPrice || item.price)))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {order.status === 'RETURN_STAFF_CONFIRMED' && (
                    <div className={cx('actions')}>
                        <button className={cx('btn', 'refund')} onClick={handleConfirmRefund}>Xác nhận hoàn tiền</button>
                    </div>
                )}
            </div>

            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
            <ConfirmDialog {...confirm} onCancel={() => setConfirm({ ...confirm, open: false })} />
        </div>
    );
}

export default ManageOrderDetailPage;
