import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './PromotionDetailPage.module.scss';
import {
    getPromotionById,
    getStoredToken,
    formatDateTime,
    mapPromotionStatus,
    DISCOUNT_VALUE_TYPES,
    APPLY_SCOPE_OPTIONS,
    approvePromotion,
    deletePromotion,
    normalizeMediaUrl
} from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

function PromotionDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [promotion, setPromotion] = useState(null);
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
                const data = await getPromotionById(id, token);
                setPromotion(data);
            } catch (err) {
                setError('Không thể tải thông tin khuyến mãi');
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
            await approvePromotion({ promotionId: id, action, reason: rejectReason }, token);
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
        if (!window.confirm('Xóa CTKM này?')) return;
        try {
            const token = getStoredToken();
            await deletePromotion(id, token);
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã xóa' });
            setTimeout(() => navigate('/admin/vouchers-promotions'), 1500);
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể xóa' });
        }
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (error || !promotion) return <div className={cx('page')}><button onClick={() => navigate(-1)}>←</button><p>{error || 'Không tìm thấy'}</p></div>;

    const statusInfo = mapPromotionStatus(promotion.status);

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết Chương trình Khuyến mãi</h1>

            <div className={cx('card')}>
                <div className={cx('header')}>
                    <span className={cx('status', statusInfo.filterKey)}>{statusInfo.label}</span>
                </div>

                <div className={cx('content')}>
                    <div className={cx('group')}><label>Tên chương trình:</label><p>{promotion.name}</p></div>
                    <div className={cx('group')}><label>Giá trị giảm:</label><p>{promotion.discountValueType === 'PERCENTAGE' ? `${promotion.discountValue}%` : `${promotion.discountValue.toLocaleString()}đ`}</p></div>
                    <div className={cx('group')}><label>Phạm vi áp dụng:</label><p>{promotion.applyScope}</p></div>
                    <div className={cx('group')}><label>Thời gian:</label><p>{formatDateTime(promotion.startDate)} - {formatDateTime(promotion.expiryDate)}</p></div>
                    <div className={cx('group')}><label>Ảnh:</label><div className={cx('img-box')}><img src={normalizeMediaUrl(promotion.imageUrl)} alt="CTKM" /></div></div>
                </div>

                <div className={cx('actions')}>
                    {promotion.status === 'PENDING_APPROVAL' && (
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
                        <h3>Duyệt CTKM</h3>
                        <p>Bạn có chắc chắn muốn duyệt chương trình này?</p>
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

export default PromotionDetailPage;
