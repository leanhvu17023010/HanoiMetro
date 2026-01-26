import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ComplaintsDetailPage.module.scss';
import { getStoredToken, formatDateTime } from '../../../../services';
import Notification from '../../../../components/Common/Notification/Notification';

const cx = classNames.bind(styles);

const statusMap = {
    NEW: 'Chờ xử lý',
    IN_PROGRESS: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    ESCALATED: 'Chuyển Admin',
};

function ComplaintsDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [notif, setNotif] = useState({ open: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const token = getStoredToken();
                const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
                const resp = await fetch(`${apiBaseUrl || 'http://localhost:8080/metro/api/v1'}/api/tickets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await resp.json();
                const ticket = data?.result || data;
                setComplaint(ticket);
                setNote(ticket.handlerNote || '');
                setSelectedStatus(ticket.status);
            } catch (err) {
                setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể tải chi tiết' });
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = getStoredToken();
            const apiBaseUrl = typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined;
            await fetch(`${apiBaseUrl || 'http://localhost:8080/metro/api/v1'}/api/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ handlerNote: note, status: selectedStatus })
            });
            setNotif({ open: true, type: 'success', title: 'Thành công', message: 'Đã cập nhật' });
            setTimeout(() => navigate('/admin/complaints'), 1500);
        } catch (e) {
            setNotif({ open: true, type: 'error', title: 'Lỗi', message: 'Không thể cập nhật' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (!complaint) return <div className={cx('page')}><button onClick={() => navigate(-1)}>←</button><p>Không tìm thấy</p></div>;

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết Khiếu nại</h1>

            <div className={cx('content-card')}>
                <div className={cx('info-section')}>
                    <p><strong>Khách hàng:</strong> {complaint.customerName}</p>
                    <p><strong>Email:</strong> {complaint.email}</p>
                    <p><strong>Ngày gửi:</strong> {formatDateTime(complaint.createdAt)}</p>
                    <p><strong>Nội dung:</strong></p>
                    <div className={cx('content-box')}>{complaint.content}</div>
                </div>

                <div className={cx('action-section')}>
                    <div className={cx('group')}>
                        <label>Trạng thái:</label>
                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                            {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div className={cx('group')}>
                        <label>Ghi chú xử lý:</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={6} placeholder="Nhập phản hồi cho khách hàng..." />
                    </div>
                    <div className={cx('actions')}>
                        <button className={cx('btn', 'cancel')} onClick={() => navigate(-1)}>Hủy</button>
                        <button className={cx('btn', 'save')} onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu & Phản hồi'}</button>
                    </div>
                </div>
            </div>

            <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
        </div>
    );
}

export default ComplaintsDetailPage;
