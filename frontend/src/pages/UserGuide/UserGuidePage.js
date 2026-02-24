import React, { useState } from 'react';
import classNames from 'classnames/bind';
import {
    FaShieldAlt,
    FaUsers,
    FaInfoCircle,
    FaLeaf,
    FaCheckCircle,
    FaTimesCircle,
    FaSmokingBan,
    FaBiohazard,
    FaTicketAlt,
    FaMobileAlt,
    FaChevronRight
} from 'react-icons/fa';
import { MdOutlineSecurity, MdOutlineCleaningServices, MdTimer } from 'react-icons/md';
import styles from './UserGuidePage.module.scss';

const cx = classNames.bind(styles);

const SECTIONS = [
    { id: 'noi-quy', title: 'Nội quy hành khách', icon: <FaShieldAlt /> },
    { id: 'van-hoa', title: 'Văn hóa Metro', icon: <FaUsers /> },
    { id: 'huong-dan', title: 'Hướng dẫn sử dụng', icon: <FaInfoCircle /> },
    { id: 'loi-ich', title: 'Lợi ích Metro', icon: <FaLeaf /> },
];

function UserGuidePage() {
    const [activeSection, setActiveSection] = useState('noi-quy');

    const renderNoiQuy = () => (
        <div className={cx('section-content')}>
            <h2>Nội quy đối với hành khách đi tàu</h2>
            <p className={cx('intro-text')}>Để đảm bảo an toàn và chất lượng dịch vụ, quý khách vui lòng chấp hành các nội quy sau:</p>

            <div className={cx('rules-grid')}>
                <div className={cx('rule-card')}>
                    <div className={cx('rule-header')}>
                        <FaTicketAlt className={cx('rule-icon')} />
                        <h3>1. Vé và Kiểm soát</h3>
                    </div>
                    <ul>
                        <li>Xếp hàng mua vé và quẹt thẻ khi qua cổng kiểm soát.</li>
                        <li>Vé hợp lệ là vé do Công ty phát hành, còn đủ thông tin và thời hạn.</li>
                        <li>Vi phạm về vé sẽ phải mua vé mới giá trị cao nhất hoặc bị từ chối phục vụ.</li>
                        <li>Trẻ em dưới 6 tuổi đi kèm người lớn được miễn phí (nhận thẻ 0đ tại quầy).</li>
                    </ul>
                </div>

                <div className={cx('rule-card')}>
                    <div className={cx('rule-header')}>
                        <MdOutlineSecurity className={cx('rule-icon')} />
                        <h3>2. Trật tự và An toàn</h3>
                    </div>
                    <ul>
                        <li>Giữ gìn trật tự, vệ sinh chung tại nhà ga và trên tàu.</li>
                        <li>Tuyệt đối không di chuyển qua vạch an toàn khi tàu chưa đến.</li>
                        <li>Không di chuyển vào khu vực kỹ thuật, nghiệp vụ hoặc buồng lái.</li>
                        <li>Nhường ghế cho trẻ em, người già, phụ nữ có thai và người khuyết tật.</li>
                    </ul>
                </div>

                <div className={cx('rule-card')}>
                    <div className={cx('rule-header')}>
                        <FaBiohazard className={cx('rule-icon')} />
                        <h3>3. Hành lý ký gửi</h3>
                    </div>
                    <ul>
                        <li>Kích thước tối đa: 56cm x 36cm x 23cm.</li>
                        <li>Trọng lượng tối đa: 18kg.</li>
                        <li>Cấm mang vật nuôi (chó, mèo...), đồ tươi sống có mùi (thịt, cá...).</li>
                        <li>Cấm các chất gây mất vệ sinh, làm bẩn nhà ga, toa xe.</li>
                    </ul>
                </div>

                <div className={cx('rule-card')}>
                    <div className={cx('rule-header')}>
                        <FaSmokingBan className={cx('rule-icon')} />
                        <h3>4. Các lệnh cấm khác</h3>
                    </div>
                    <ul>
                        <li>Tuyệt đối không hút thuốc trong nhà ga và trên tàu.</li>
                        <li>Cấm mang vũ khí, vật liệu cháy nổ, hàng hóa bị pháp luật cấm.</li>
                        <li>Cấm trộm cắp, phá hoại tài sản thiết bị nhà ga.</li>
                        <li>Nhà ga từ chối phục vụ người say rượu, mất trí, bệnh truyền nhiễm.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderVanHoa = () => (
        <div className={cx('section-content')}>
            <h2>Văn hóa Metro</h2>
            <div className={cx('culture-banner')}>
                <p>"Hành trình xanh cùng Hà Nội Metro không chỉ là đi lại, mà còn là lan tỏa nét đẹp văn minh đô thị."</p>
            </div>

            <div className={cx('culture-list')}>
                <div className={cx('culture-item')}>
                    <div className={cx('item-num')}>01</div>
                    <div className={cx('item-text')}>
                        <h4>Sự ưu tiên</h4>
                        <p>Luôn sẵn lòng nhường ghế cho người già, trẻ em, phụ nữ có thai và người khuyết tật.</p>
                    </div>
                </div>
                <div className={cx('culture-item')}>
                    <div className={cx('item-num')}>02</div>
                    <div className={cx('item-text')}>
                        <h4>Sự tĩnh lặng</h4>
                        <p>Để điện thoại ở chế độ im lặng và nói chuyện với âm lượng vừa phải, tránh làm phiền người xung quanh.</p>
                    </div>
                </div>
                <div className={cx('culture-item')}>
                    <div className={cx('item-num')}>03</div>
                    <div className={cx('item-text')}>
                        <h4>An toàn cho lái tàu</h4>
                        <p>Không chụp ảnh với đèn flash hoặc thiết bị chiếu sáng mạnh vì có thể gây nguy hiểm cho nhân viên lái tàu.</p>
                    </div>
                </div>
                <div className={cx('culture-item')}>
                    <div className={cx('item-num')}>04</div>
                    <div className={cx('item-text')}>
                        <h4>Văn minh khi lên tàu</h4>
                        <p>Dừng lại khi cửa tàu bắt đầu đóng. Không xô đẩy tại vị trí chờ và không dùng điện thoại khi đang bước lên tàu.</p>
                    </div>
                </div>
                <div className={cx('culture-item')}>
                    <div className={cx('item-num')}>05</div>
                    <div className={cx('item-text')}>
                        <h4>Sạch sẽ và Chuyên nghiệp</h4>
                        <p>Bỏ rác đúng nơi quy định và tuân thủ tuyệt đối sự hướng dẫn của nhân viên nhà ga.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHuongDan = () => (
        <div className={cx('section-content')}>
            <h2>Hướng dẫn sử dụng hệ thống</h2>

            <div className={cx('guide-steps')}>
                <div className={cx('step-card')}>
                    <div className={cx('step-icon')}>
                        <FaMobileAlt />
                    </div>
                    <h3>Bước 1: Tải Ứng dụng</h3>
                    <p>Quét mã QR tại ga để tải App Hanoi Metro. Đăng ký tài khoản và định danh để bắt đầu mua vé trực tuyến.</p>
                </div>
                <div className={cx('step-arrow')}><FaChevronRight /></div>
                <div className={cx('step-card')}>
                    <div className={cx('step-icon')}>
                        <FaTicketAlt />
                    </div>
                    <h3>Bước 2: Sở hữu Vé</h3>
                    <p>Mua vé lượt tại máy bán vé tự động hoặc nạp tiền vào thẻ vé tháng. Bạn cũng có thể dùng QR Code trên ứng dụng.</p>
                </div>
                <div className={cx('step-arrow')}><FaChevronRight /></div>
                <div className={cx('step-card')}>
                    <div className={cx('step-icon')}>
                        <FaCheckCircle />
                    </div>
                    <h3>Bước 3: Qua Cổng</h3>
                    <p>Quẹt thẻ hoặc mã QR tại cổng kiểm soát. Lưu ý tư thế quẹt vé để hệ thống nhận diện nhanh nhất.</p>
                </div>
            </div>

            <div className={cx('usage-tips')}>
                <div className={cx('tip-box')}>
                    <FaInfoCircle className={cx('tip-icon')} />
                    <div>
                        <h4>Lưu ý khi quẹt vé</h4>
                        <p>Đặt vé song song với mặt máy quét. Giữ khoảng cách 3-5cm để cảm biến hoạt động chính xác.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLoiIch = () => (
        <div className={cx('section-content')}>
            <h2>Lợi ích của việc sử dụng Metro</h2>

            <div className={cx('benefits-split')}>
                <div className={cx('benefit-group')}>
                    <div className={cx('group-header')}>
                        <FaLeaf />
                        <h3>Bảo vệ Môi trường</h3>
                    </div>
                    <div className={cx('benefit-tags')}>
                        <span>Không khí thải độc hại</span>
                        <span>Giảm tiếng ồn đô thị</span>
                        <span>Tăng diện tích cây xanh</span>
                        <span>Tiết kiệm năng lượng</span>
                    </div>
                    <p>Tàu chạy hoàn toàn bằng điện, giúp giảm hiệu ứng nhà kính và bảo vệ không gian sống trong lành cho thủ đô.</p>
                </div>

                <div className={cx('benefit-group')}>
                    <div className={cx('group-header')}>
                        <FaUsers />
                        <h3>Tác động Xã hội</h3>
                    </div>
                    <div className={cx('benefit-tags')}>
                        <span>Giảm ùn tắc giao thông</span>
                        <span>Tạo hàng ngàn việc làm</span>
                        <span>Thúc đẩy kinh tế dọc tuyến</span>
                        <span>Văn hóa đi lại văn minh</span>
                    </div>
                    <p>Metro không chỉ là phương tiện, mà còn là động lực phát triển kinh tế mạnh mẽ cho các khu vực xung quanh nhà ga.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('hero')}>
                <div className={cx('hero-overlay')} />
                <div className={cx('hero-content')}>
                    <h1>HƯỚNG DẪN SỬ DỤNG</h1>
                    <p>Mọi thông tin bạn cần để có một hành trình an toàn và trọn vẹn tại Hanoi Metro</p>
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
                            <h4>Cần hỗ trợ?</h4>
                            <p>Hotline: (024) 3855.3388</p>
                            <button className={cx('contact-btn')}>Liên hệ ngay</button>
                        </div>
                    </aside>

                    <main className={cx('main')}>
                        <div className={cx('content-card')}>
                            {activeSection === 'noi-quy' && renderNoiQuy()}
                            {activeSection === 'van-hoa' && renderVanHoa()}
                            {activeSection === 'huong-dan' && renderHuongDan()}
                            {activeSection === 'loi-ich' && renderLoiIch()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UserGuidePage;
