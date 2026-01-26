import classNames from 'classnames/bind';
import styles from './StaffMainPage.module.scss';
import { useNavigate } from 'react-router-dom';
import StaffHeader from '../../../layouts/components/Header/Staff/StaffHeader';

const cx = classNames.bind(styles);

export default function StaffMainPage() {
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Tuyến & Nhà ga', desc: 'Quản lý thông tin tuyến metro và các nhà ga.', path: '/staff/products' },
        { title: 'Tin tức & Thông báo', desc: 'Đăng tải các tin tức hoạt động, vận hành.', path: '/staff/content' },
        { title: 'Quản lý Vé/Đơn hàng', desc: 'Theo dõi đơn hàng vé và hỗ trợ hành khách.', path: '/staff/orders' },
        { title: 'Ưu đãi & Voucher', desc: 'Quản lý các chương trình ưu đãi cho hành khách.', path: '/staff/vouchers' },
    ];

    return (
        <div className={cx('staff-main')}>
            <div className={cx('header-section')}>
                <StaffHeader />
            </div>
            <div className={cx('wrap')}>
                {menuItems.map((item, index) => (
                    <div key={index} className={cx('card')} onClick={() => navigate(item.path)}>
                        <div className={cx('card-title')}>{item.title}</div>
                        <div className={cx('card-desc')}>{item.desc}</div>
                    </div>
                ))}

                <div className={cx('card', 'quick-actions')}>
                    <div className={cx('card-title')}>Tác vụ nhanh</div>
                    <div className={cx('actions')}>
                        <button className={cx('btn')} onClick={() => navigate('/staff/products/new')}>Thêm Tuyến mới</button>
                        <button className={cx('btn')} onClick={() => navigate('/staff/content/add-banner')}>Đăng tin mới</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
