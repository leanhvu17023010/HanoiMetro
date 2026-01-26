import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ReportsAnalyticsPage.module.scss';
import { getStoredToken, formatDateTime } from '../../../services';

const cx = classNames.bind(styles);

function ReportsAnalyticsPage() {
    const [timeMode, setTimeMode] = useState('month');
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = getStoredToken();
            const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
            const base = apiBaseUrl || 'http://localhost:8080/metro/api/v1';

            // Mocking some data if API is not fully ready for analytics
            // In real world, we would call /api/financial/summary or similar
            const resp = await fetch(`${base}/orders/statistics?mode=${timeMode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            const res = data?.result || data || {};

            setSummary({
                totalRevenue: res.totalRevenue || 0,
                totalOrders: res.totalOrders || 0,
                totalCustomers: res.totalCustomers || 0
            });

            setRevenueData(res.chartData || []);
        } catch (e) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, [timeMode]);

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    return (
        <div className={cx('page')}>
            <h1 className={cx('title')}>Báo cáo & Thống kê</h1>

            <div className={cx('filters')}>
                <select value={timeMode} onChange={e => setTimeMode(e.target.value)}>
                    <option value="day">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>
                <button className={cx('refresh-btn')} onClick={fetchStats}>Cập nhật nhật dữ liệu</button>
            </div>

            <div className={cx('summary-grid')}>
                <div className={cx('summary-card')}>
                    <h3>Tổng doanh thu</h3>
                    <p className={cx('value')}>{formatPrice(summary.totalRevenue)}</p>
                </div>
                <div className={cx('summary-card')}>
                    <h3>Số đơn hàng</h3>
                    <p className={cx('value')}>{summary.totalOrders}</p>
                </div>
                <div className={cx('summary-card')}>
                    <h3>Khách hàng mới</h3>
                    <p className={cx('value')}>{summary.totalCustomers}</p>
                </div>
            </div>

            <div className={cx('chart-placeholder')}>
                <h3>Biểu đồ doanh thu ({timeMode})</h3>
                <div className={cx('chart-box')}>
                    {loading ? <p>Đang tải biểu đồ...</p> : (
                        <p style={{ color: '#999', fontSize: '13px' }}>[ Biểu đồ doanh thu trực quan - Dữ liệu thực tế từ hệ thống ]</p>
                    )}
                </div>
            </div>

            <div className={cx('recent-activity')}>
                <h3>Dữ liệu chi tiết</h3>
                <div className={cx('table-wrap')}>
                    <table className={cx('table')}>
                        <thead><tr><th>Thời gian</th><th>Doanh thu</th><th>Đơn hàng</th></tr></thead>
                        <tbody>
                            {revenueData.length === 0 ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu chi tiết</td></tr> : revenueData.map((d, i) => (
                                <tr key={i}><td>{d.time}</td><td>{formatPrice(d.value)}</td><td>{d.count}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ReportsAnalyticsPage;
