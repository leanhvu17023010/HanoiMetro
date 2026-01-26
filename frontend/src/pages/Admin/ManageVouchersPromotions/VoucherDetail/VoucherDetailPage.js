import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './VoucherDetailPage.module.scss';
import {
    getVoucherById,
    getStoredToken,
    formatDateTime,
    mapVoucherStatus,
    approveVoucher,
    deleteVoucher,
    normalizeMediaUrl
} from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

function VoucherDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [voucher, setVoucher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const token = getStoredToken();
                const data = await getVoucherById(id, token);
                setVoucher(data);
            } catch (err) {
                setError('Không thể tải thông tin voucher');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleAction = async (action) => {
        setProcessing(true);
        try {
            const token = getStoredToken();
            await approveVoucher({ voucherId: id, action, reason: rejectReason }, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: action === 'APPROVE' ? 'Đã duyệt' : 'Đã từ chối' });
            setTimeout(() => navigate('/admin/vouchers-promotions'), 1500);
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Thao tác thất bại' });
        } finally {
            setProcessing(false);
            setShowApprove(false);
            setShowReject(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Xóa voucher này?')) return;
        try {
            const token = getStoredToken();
            await deleteVoucher(id, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã xóa' });
            setTimeout(() => navigate('/admin/vouchers-promotions'), 1500);
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể xóa' });
        }
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (error || !voucher) return <div className={cx('page')}><button onClick={() => navigate(-1)}>←</button><p>{error || 'Không tìm thấy'}</p></div>;

    const statusInfo = mapVoucherStatus(voucher.status);

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết Voucher</h1>

            <div className={cx('card')}>
                <div className={cx('header')}>
                    <span className={cx('status', statusInfo.filterKey)}>{statusInfo.label}</span>
                </div>

                <div className={cx('content')}>
                    <div className={cx('group')}><label>Tên chương trình:</label><p>{voucher.name}</p></div>
                    <div className={cx('group')}><label>Mã voucher:</label><p className={cx('code')}>{voucher.code}</p></div>
                    <div className={cx('group')}><label>Giá trị giảm:</label><p>{voucher.discountValueType === 'PERCENTAGE' ? `${voucher.discountValue}%` : `${voucher.discountValue.toLocaleString()}đ`}</p></div>
                    <div className={cx('group')}><label>Hạn mức giảm tối đa:</label><p>{voucher.maxDiscountValue.toLocaleString()}đ</p></div>
                    <div className={cx('group')}><label>Đơn hàng tối thiểu:</label><p>{voucher.minOrderValue.toLocaleString()}đ</p></div>
                    <div className={cx('group')}><label>Thời gian:</label><p>{formatDateTime(voucher.startDate)} - {formatDateTime(voucher.expiryDate)}</p></div>
                    <div className={cx('group')}><label>Ảnh:</label><div className={cx('img-box')}><img src={normalizeMediaUrl(voucher.imageUrl)} alt="Voucher" /></div></div>
                </div>

                <div className={cx('actions')}>
                    {voucher.status === 'PENDING_APPROVAL' && (
                        <>
                            <button className={cx('btn', 'approve')} onClick={() => setShowApprove(true)}>Duyệt</button>
                            <button className={cx('btn', 'reject')} onClick={() => setShowReject(true)}>Từ chối</button>
                        </>
                    )}
                    <button className={cx('btn', 'delete')} onClick={handleDelete}>Xóa</button>
                </div>
            </div>

            {showReject && (
                <div className={cx('modal')}>
                    <div className={cx('modal-box')}>
                        <h3>Lý do từ chối</h3>
                        <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4} />
                        <div className={cx('m-actions')}>
                            <button onClick={() => setShowReject(false)}>Hủy</button>
                            <button className={cx('confirm')} onClick={() => handleAction('REJECT')} disabled={processing}>Xác nhận từ chối</button>
                        </div>
                    </div>
                </div>
            )}

            {showApprove && (
                <div className={cx('modal')}>
                    <div className={cx('modal-box')}>
                        <h3>Duyệt Voucher</h3>
                        <p>Bạn có chắc chắn muốn duyệt voucher này?</p>
                        <div className={cx('m-actions')}>
                            <button onClick={() => setShowApprove(false)}>Hủy</button>
                            <button className={cx('confirm', 'ok')} onClick={() => handleAction('APPROVE')} disabled={processing}>Đồng ý duyệt</button>
                        </div>
                    </div>
                </div>
            )}

            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
        </div>
    );
}

export default VoucherDetailPage;
