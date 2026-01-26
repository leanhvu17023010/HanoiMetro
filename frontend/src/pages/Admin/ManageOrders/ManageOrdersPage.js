import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageOrdersPage.module.scss';
import { formatDateTime, getStoredToken } from '../../../services';

const cx = classNames.bind(styles);

const mapOrderStatus = (statusRaw) => {
    const status = String(statusRaw || '').toUpperCase();
    switch (status) {
        case 'CREATED':
        case 'PENDING': return { label: 'Chờ xác nhận', css: 'pending' };
        case 'CONFIRMED':
        case 'PAID': return { label: 'Đang xử lý', css: 'processing' };
        case 'DELIVERED': return { label: 'Đã hoàn thành', css: 'delivered' };
        case 'CANCELLED': return { label: 'Đã hủy', css: 'cancelled' };
        case 'REFUNDED': return { label: 'Đã hoàn tiền', css: 'refunded' };
        default: return { label: statusRaw || 'Chờ xác nhận', css: 'pending' };
    }
};

function ManageOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('orders');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = getStoredToken();
            const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
            const resp = await fetch(`${apiBaseUrl || 'http://localhost:8080/metro/api/v1'}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            const list = data?.result || data || [];
            setOrders(Array.isArray(list) ? list : []);
        } catch (err) {
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filteredOrders = useMemo(() => {
        let list = orders;
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(o => (o.code || o.id).toLowerCase().includes(q) || (o.customerName || '').toLowerCase().includes(q));
        }
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [orders, searchTerm]);

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    return (
        <div className={cx('page')}>
            <div className={cx('header')}><h1>Quản lý Vé & Đơn hàng</h1></div>

            <div className={cx('tabs')}>
                <button className={cx('tab', { active: activeTab === 'orders' })} onClick={() => setActiveTab('orders')}>Đơn hàng mới</button>
                <button className={cx('tab', { active: activeTab === 'refunds' })} onClick={() => setActiveTab('refunds')}>Yêu cầu hoàn trả</button>
            </div>

            <div className={cx('filters')}>
                <input className={cx('searchInput')} placeholder="Tìm theo mã đơn, khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            {loading ? <div className={cx('status')}>Đang tải...</div> : error ? <div className={cx('status', 'error')}>{error}</div> : (
                <div className={cx('tableWrapper')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td></tr> : filteredOrders.map(o => {
                                const { label, css } = mapOrderStatus(o.status);
                                return (
                                    <tr key={o.id}>
                                        <td>#{o.code || o.id}</td>
                                        <td>{o.customerName || o.userFullName || 'Khách hàng'}</td>
                                        <td>{formatDateTime(o.createdAt)}</td>
                                        <td>{formatPrice(o.totalAmount)}</td>
                                        <td><span className={cx('statusBadge', css)}>{label}</span></td>
                                        <td><button className={cx('detailButton')} onClick={() => navigate(`/admin/orders/${o.id}`)}>Chi tiết</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageOrdersPage;
