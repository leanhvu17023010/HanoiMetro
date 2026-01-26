import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import logoHanoiMetro from '../../../assets/images/img_sach.png'; // Placeholder logo

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('footer-col')}>
                    <div className={cx('logo-section')}>
                        <img src={logoHanoiMetro} alt="Hanoi Metro" className={cx('logo')} />
                    </div>
                    <div className={cx('contact-info')}>
                        <p><strong>Trụ sở chính:</strong> Số 8 Hồ Xuân Hương, Hai Bà Trưng, Hà Nội</p>
                        <p><strong>Số điện thoại:</strong> (024) 3855.3388</p>
                        <p><strong>Email:</strong> hmc@metrohanoi.vn</p>
                    </div>
                </div>

                <div className={cx('footer-col')}>
                    <h4>Thông tin doanh nghiệp</h4>
                    <ul className={cx('footer-links')}>
                        <li><Link to="/about-us/announcements">Công bố thông tin doanh nghiệp</Link></li>
                        <li><Link to="/about-us/contact">Liên hệ</Link></li>
                        <li><Link to="/about-us/organization">Sơ đồ tổ chức</Link></li>
                        <li><Link to="/about-us/vision">Tầm nhìn - Sứ mệnh</Link></li>
                        <li><Link to="/about-us/policy">Quyết định - Quy chế công ty</Link></li>
                    </ul>
                </div>

                <div className={cx('footer-col')}>
                    <h4>Liên kết hữu ích</h4>
                    <ul className={cx('footer-links')}>
                        <li><Link to="/metro-network">Mạng lưới Metro</Link></li>
                        <li><Link to="/afc-tickets">Thông tin vé</Link></li>
                        <li><Link to="/metro-userguide">Hướng dẫn sử dụng</Link></li>
                        <li><Link to="/recruitment">Tuyển dụng</Link></li>
                    </ul>
                </div>
            </div>

            <div className={cx('footer-bottom')}>
                <div className={cx('container')}>
                    <p>&copy; {new Date().getFullYear()} Hanoi Metro. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
