import React, { useState } from 'react';
import classNames from 'classnames/bind';
import {
    FaTicketAlt,
    FaCalculator,
    FaCreditCard,
    FaUserGraduate,
    FaChartLine,
    FaSearchDollar,
    FaInfoCircle,
    FaChevronRight
} from 'react-icons/fa';
import { MdOutlineDateRange, MdPayments } from 'react-icons/md';
import styles from './TicketInfoPage.module.scss';
import fare2A from '../../assets/images/fares/fare_2a.jpg';
import fare3 from '../../assets/images/fares/fare_3.jpg';

const cx = classNames.bind(styles);

const SECTIONS = [
    { id: 'gia-ve', title: 'Giá vé các tuyến', icon: <FaSearchDollar /> },
    { id: 'loai-ve', title: 'Các loại thẻ vé', icon: <FaCreditCard /> },
    { id: 'doi-tuong', title: 'Đối tượng ưu tiên', icon: <FaUserGraduate /> },
];

function TicketInfoPage() {
    const [activeSection, setActiveSection] = useState('gia-ve');
    const [lineTab, setLineTab] = useState('2a');

    const renderGiaVe = () => (
        <div className={cx('section-content')}>
            <h2>Giá vé các tuyến Hà Nội Metro</h2>
            <p className={cx('intro-text')}>Bảng giá vé áp dụng theo Quyết định số 3316/QĐ-UBND của UBND Thành phố Hà Nội.</p>

            <div className={cx('fare-image-selector')}>
                <div className={cx('selector-tabs')}>
                    <button
                        className={cx('tab-btn', { active: lineTab === '2a' })}
                        onClick={() => setLineTab('2a')}
                    >
                        Tuyến 2A: Cát Linh - Hà Đông
                    </button>
                    <button
                        className={cx('tab-btn', { active: lineTab === '3' })}
                        onClick={() => setLineTab('3')}
                    >
                        Tuyến 3: Nhổn - Ga Hà Nội
                    </button>
                </div>

                <div className={cx('image-container')}>
                    {lineTab === '2a' ? (
                        <img src={fare2A} alt="Bảng giá vé Tuyến 2A" className={cx('fare-img')} />
                    ) : (
                        <img src={fare3} alt="Bảng giá vé Tuyến 3" className={cx('fare-img')} />
                    )}
                </div>

                <p className={cx('image-note')}>* Bạn có thể phóng to hình ảnh để xem rõ chi tiết mức giá giữa các ga.</p>
            </div>

            <div className={cx('monthly-info')}>
                <h3><MdOutlineDateRange /> Vé Tháng (Áp dụng chung)</h3>
                <div className={cx('monthly-grid')}>
                    <div className={cx('monthly-item')}>
                        <h4>200.000 VNĐ</h4>
                        <p>Hành khách phổ thông (Vé không ưu tiên)</p>
                    </div>
                    <div className={cx('monthly-item')}>
                        <h4>100.000 VNĐ</h4>
                        <p>Học sinh, sinh viên, công nhân khu công nghiệp</p>
                    </div>
                    <div className={cx('monthly-item')}>
                        <h4>140.000 VNĐ</h4>
                        <p>Mẫu tập thể (Mua cho từ 30 người trở lên)</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLoaiVe = () => (
        <div className={cx('section-content')}>
            <h2>Các loại thẻ vé Metro</h2>
            <div className={cx('ticket-types-grid')}>
                <div className={cx('ticket-type-card')}>
                    <div className={cx('ticket-visual', 'single-trip')}>
                        <FaTicketAlt />
                    </div>
                    <h4>Vé lượt (Single Journey)</h4>
                    <p>Dành cho hành khách đi lại không thường xuyên. Có dạng thẻ chip hoặc mã QR trên App.</p>
                    <span className={cx('usage-tag')}>Sử dụng trong ngày</span>
                </div>

                <div className={cx('ticket-type-card')}>
                    <div className={cx('ticket-visual', 'day-pass')}>
                        <MdOutlineDateRange />
                    </div>
                    <h4>Vé ngày (Day Pass)</h4>
                    <p>Đi lại không giới hạn số lượt trên tất cả các tuyến trong vòng 01 ngày (có hiệu lực từ giờ mở ga đến giờ đóng ga).</p>
                    <span className={cx('usage-tag')}>Tiết kiệm cho du khách</span>
                </div>

                <div className={cx('ticket-type-card')}>
                    <div className={cx('ticket-visual', 'monthly-card')}>
                        <FaCreditCard />
                    </div>
                    <h4>Thẻ vé tháng (IC Card)</h4>
                    <p>Thẻ thông minh có thể nạp tiền và gia hạn hàng tháng tại quầy vé hoặc qua ứng dụng di động.</p>
                    <span className={cx('usage-tag')}>Dành cho khách đi làm/học</span>
                </div>
            </div>

            <div className={cx('app-promo')}>
                <div className={cx('promo-content')}>
                    <h4>Mua vé nhanh chóng trên App "Hà Nội Metro"</h4>
                    <p>Tiết kiệm thời gian, không cần xếp hàng, thanh toán đa dạng qua ví điện tử và ngân hàng.</p>
                </div>
                <button className={cx('download-btn')}>Tải App ngay</button>
            </div>
        </div>
    );

    const renderDoiTuong = () => (
        <div className={cx('section-content')}>
            <h2>Đối tượng ưu tiên & Miễn phí</h2>
            <div className={cx('priority-box')}>
                <div className={cx('priority-item')}>
                    <FaCheckCircle className={cx('check-icon')} />
                    <div>
                        <h4>Miễn phí 100% (Vé 0 đồng)</h4>
                        <ul>
                            <li>Trẻ em dưới 6 tuổi (đi kèm người lớn).</li>
                            <li>Người có công với cách mạng.</li>
                            <li>Người cao tuổi (từ 60 tuổi trở lên).</li>
                            <li>Người khuyết tật.</li>
                            <li>Người thuộc hộ nghèo.</li>
                        </ul>
                        <p className={cx('note')}>* Quý khách vui lòng xuất trình giấy tờ tùy thân tại quầy để nhận thẻ MIỄN PHÍ.</p>
                    </div>
                </div>

                <div className={cx('priority-item')}>
                    <FaUserGraduate className={cx('check-icon')} />
                    <div>
                        <h4>Giảm giá 50% Vé Tháng</h4>
                        <ul>
                            <li>Học sinh, sinh viên tại các trường đào tạo chính quy.</li>
                            <li>Công nhân đang làm việc tại các khu công nghiệp.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('hero')}>
                <div className={cx('hero-overlay')} />
                <div className={cx('hero-content')}>
                    <h1>THÔNG TIN VÉ & GIÁ VÉ</h1>
                    <p>Giải pháp di chuyển tiết kiệm, hiện đại và văn minh cho mọi hành khách</p>
                </div>
            </div>

            <div className={cx('container')}>
                <div className={cx('layout')}>
                    <aside className={cx('sidebar')}>
                        {SECTIONS.map(section => (
                            <button
                                key={section.id}
                                className={cx('nav-item', { active: activeSection === section.id })}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <span className={cx('nav-icon')}>{section.icon}</span>
                                <span className={cx('nav-title')}>{section.title}</span>
                                <FaChevronRight className={cx('nav-arrow')} />
                            </button>
                        ))}

                        <div className={cx('contact-card')}>
                            <h4>Góp ý dịch vụ?</h4>
                            <p>Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện dịch vụ vé.</p>
                            <button className={cx('contact-btn')}>Gửi phản hồi</button>
                        </div>
                    </aside>

                    <main className={cx('main')}>
                        <div className={cx('content-card')}>
                            {activeSection === 'gia-ve' && renderGiaVe()}
                            {activeSection === 'loai-ve' && renderLoaiVe()}
                            {activeSection === 'doi-tuong' && renderDoiTuong()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

const FaCheckCircle = ({ className }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
    </svg>
);

export default TicketInfoPage;
