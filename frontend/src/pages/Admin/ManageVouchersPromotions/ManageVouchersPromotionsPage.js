import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ManageVouchersPromotionsPage.module.scss';
import {
    getStoredToken,
    mapVoucherStatus,
    mapPromotionStatus,
    VOUCHER_PROMOTION_SORT_OPTIONS,
    fetchAllItemsByStatus,
} from '../../../services';

const cx = classNames.bind(styles);

function ManageVouchersPromotionsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [allVouchers, setAllVouchers] = useState([]);
    const [allPromotions, setAllPromotions] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const token = getStoredToken();
            const [vouchers, promotions] = await Promise.all([
                fetchAllItemsByStatus('voucher', token),
                fetchAllItemsByStatus('promotion', token),
            ]);

            const mappedV = (vouchers || []).map(v => ({
                ...v,
                statusLabel: mapVoucherStatus(v.status).label,
                statusFilterKey: mapVoucherStatus(v.status).filterKey
            }));
            const mappedP = (promotions || []).map(p => ({
                ...p,
                statusLabel: mapPromotionStatus(p.status).label,
                statusFilterKey: mapPromotionStatus(p.status).filterKey
            }));

            setAllVouchers(mappedV);
            setAllPromotions(mappedP);
            applyFilters(searchTerm, statusFilter, mappedV, mappedP);
        } catch (e) {
            setError('Không thể tải dữ liệu Khuyến mãi & Voucher');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const applyFilters = (search, status, vData = allVouchers, pData = allPromotions) => {
        let fV = vData;
        let fP = pData;
        if (search.trim()) {
            const s = search.toLowerCase();
            fV = fV.filter(v => (v.code || '').toLowerCase().includes(s) || (v.name || '').toLowerCase().includes(s));
            fP = fP.filter(p => (p.name || '').toLowerCase().includes(s));
        }
        if (status !== 'all') {
            fV = fV.filter(v => v.statusFilterKey === status);
            fP = fP.filter(p => p.statusFilterKey === status);
        }
        setFilteredVouchers(fV);
        setFilteredPromotions(fP);
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '-';

    return (
        <div className={cx('admin-page')}>
            <h1 className={cx('page-title')}>Quản lý Khuyến mãi & Voucher</h1>

            <div className={cx('controls')}>
                <input className={cx('search')} placeholder="Tìm theo mã, tên..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); applyFilters(e.target.value, statusFilter); }} />
                <select className={cx('status-select')} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); applyFilters(searchTerm, e.target.value); }}>
                    {VOUCHER_PROMOTION_SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>

            {loading ? <div className={cx('status')}>Đang tải...</div> : error ? <div className={cx('status', 'error')}>{error}</div> : (
                <div className={cx('lists')}>
                    <section className={cx('section')}>
                        <h2>Vouchers</h2>
                        <div className={cx('table-wrap')}>
                            <table className={cx('table')}>
                                <thead><tr><th>Mã</th><th>Tên</th><th>Giá trị</th><th>Hạn dùng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                                <tbody>
                                    {filteredVouchers.length === 0 ? <tr><td colSpan="6">Không có dữ liệu</td></tr> : filteredVouchers.map(v => (
                                        <tr key={v.id}>
                                            <td>{v.code}</td>
                                            <td>{v.name}</td>
                                            <td>{v.discountValueType === 'PERCENTAGE' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()}đ`}</td>
                                            <td>{formatDate(v.expiryDate)}</td>
                                            <td><span className={cx('badge', v.statusFilterKey)}>{v.statusLabel}</span></td>
                                            <td><button className={cx('btn')} onClick={() => navigate(`/admin/vouchers/${v.id}`)}>Xem</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className={cx('section')}>
                        <h2>Chương trình Khuyến mãi</h2>
                        <div className={cx('table-wrap')}>
                            <table className={cx('table')}>
                                <thead><tr><th>Tên CTKM</th><th>Giảm giá</th><th>Áp dụng</th><th>Hạn dùng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                                <tbody>
                                    {filteredPromotions.length === 0 ? <tr><td colSpan="6">Không có dữ liệu</td></tr> : filteredPromotions.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>{p.discountValueType === 'PERCENTAGE' ? `${p.discountValue}%` : `${p.discountValue.toLocaleString()}đ`}</td>
                                            <td>{p.applyScope}</td>
                                            <td>{formatDate(p.expiryDate)}</td>
                                            <td><span className={cx('badge', p.statusFilterKey)}>{p.statusLabel}</span></td>
                                            <td><button className={cx('btn')} onClick={() => navigate(`/admin/promotions/${p.id}`)}>Xem</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default ManageVouchersPromotionsPage;
