import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    FaHistory,
    FaBullseye,
    FaEye,
    FaGem,
    FaUsers,
    FaMapMarkedAlt,
    FaShieldAlt,
    FaLeaf,
    FaAward,
    FaInfoCircle,
    FaSitemap,
    FaFileContract,
    FaFingerprint,
    FaPhoneAlt,
    FaChevronRight
} from 'react-icons/fa';
import { MdOutlineDateRange, MdPayments } from 'react-icons/md';
import styles from './AboutPage.module.scss';
import orgChartImg from '../../assets/images/SoDoToChucCty.jpg';
import { getApiBaseUrl } from '../../services';

const cx = classNames.bind(styles);

const SECTIONS = [
    { id: 'gioi-thieu', title: 'Giới thiệu công ty', icon: <FaInfoCircle /> },
    { id: 'cong-bo', title: 'Công bố thông tin doanh nghiệp', icon: <FaFileContract /> },
    { id: 'lien-he', title: 'Liên hệ', icon: <FaPhoneAlt /> },
    { id: 'so-do', title: 'Sơ đồ tổ chức', icon: <FaSitemap /> },
    { id: 'tam-nhin', title: 'Tầm nhìn - Sứ mệnh', icon: <FaEye /> },
    { id: 'quy-che', title: 'QUYẾT ĐỊNH – QUY CHẾ CÔNG TY', icon: <FaFileContract /> },
    { id: 'bieu-tuong', title: 'Ý nghĩa biểu tượng', icon: <FaFingerprint /> },
];

const HISTORY_TIMELINE = [
    {
        year: '2014',
        event: 'Thành lập Công ty TNHH MTV Đường sắt Hà Nội (Hanoi Metro)',
        desc: 'Theo Quyết định số 6266/QĐ-UBND ngày 27/11/2014 của UBND TP Hà Nội.'
    },
    {
        year: '2021',
        event: 'Vận hành thương mại Tuyến số 2A Cát Linh - Hà Đông',
        desc: 'Tuyến đường sắt đô thị đầu tiên của Việt Nam chính thức đi vào hoạt động.'
    },
    {
        year: '2024',
        event: 'Vận hành đoạn trên cao Tuyến số 3 Nhổn - Ga Hà Nội',
        desc: 'Mở rộng mạng lưới metro, kết nối khu vực phía Tây vào trung tâm thành phố.'
    }
];

const CORE_VALUES = [
    {
        icon: <FaShieldAlt />,
        title: 'An toàn',
        desc: 'Đặt sự an toàn của hành khách và nhân viên lên hàng đầu trong mọi hoạt động vận hành.'
    },
    {
        icon: <FaAward />,
        title: 'Chất lượng',
        desc: 'Cung cấp dịch vụ vận tải công cộng tiêu chuẩn quốc tế, tiện nghi và hiện đại.'
    },
    {
        icon: <FaUsers />,
        title: 'Văn minh',
        desc: 'Xây dựng văn hóa giao thông mới, thân thiện và chuyên nghiệp cho người dân Thủ đô.'
    },
    {
        icon: <FaLeaf />,
        title: 'Bền vững',
        desc: 'Góp phần bảo vệ môi trường và phát triển đô thị xanh thông qua giao thông sạch.'
    }
];

function AboutPage() {
    const { hash } = useLocation();
    const [activeSection, setActiveSection] = useState('gioi-thieu');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        content: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const apiBaseUrl = getApiBaseUrl();
            const response = await fetch(`${apiBaseUrl}/api/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ customerName: '', email: '', phone: '', content: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            alert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (hash) {
            const sectionId = hash.replace('#', '');
            if (SECTIONS.some(s => s.id === sectionId)) {
                setActiveSection(sectionId);
            }
        }
        window.scrollTo(0, 0);
    }, [hash]);

    return (
        <div className={cx('wrapper')}>
            <section className={cx('hero')}>
                <div className={cx('hero-content')}>
                    <h1>GIỚI THIỆU CÔNG TY</h1>
                    <p>Hanoi Metro - Kết nối tương lai xanh</p>
                </div>
            </section>

            <div className={cx('main-content')}>
                <div className={cx('container')}>
                    <div className={cx('page-layout')}>
                        {/* Sidebar */}
                        <aside className={cx('sidebar')}>
                            <div className={cx('sidebar-header')}>
                                <h3>DANH MỤC</h3>
                            </div>
                            <nav className={cx('sidebar-nav')}>
                                {SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        className={cx('nav-item', { active: activeSection === section.id })}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            window.scrollTo({ top: 400, behavior: 'smooth' });
                                        }}
                                    >
                                        <span className={cx('icon')}>{section.icon}</span>
                                        <span className={cx('title')}>{section.title}</span>
                                        <FaChevronRight className={cx('arrow')} />
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <main className={cx('content-area')}>
                            {activeSection === 'gioi-thieu' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>GIỚI THIỆU CHUNG</h2>
                                    <p className={cx('highlight-text')}>
                                        Công ty Trách nhiệm hữu hạn Một thành viên Đường sắt Hà Nội (Hanoi Metro) là doanh nghiệp 100% vốn nhà nước thuộc UBND Thành phố Hà Nội.
                                    </p>
                                    <div className={cx('text-block')}>
                                        <p>Được thành lập ngày 27/11/2014, Hanoi Metro mang trong mình sứ mệnh vận hành hệ thống đường sắt đô thị hiện đại lần đầu tiên xuất hiện tại Việt Nam. Chúng tôi không chỉ cung cấp dịch vụ vận tải, mà còn kiến tạo một phong cách sống xanh, văn minh và an toàn cho cộng đồng.</p>
                                        <div className={cx('info-card')}>
                                            <ul>
                                                <li><strong>Tên đầy đủ:</strong> Công ty TNHH MTV Đường sắt Hà Nội</li>
                                                <li><strong>Tên giao dịch:</strong> Hanoi Metro Company (HMC)</li>
                                                <li><strong>Trụ sở:</strong> Số 8 Hồ Xuân Hương, Hai Bà Trưng, Hà Nội</li>
                                                <li><strong>Lĩnh vực:</strong> Vận tải hành khách đường sắt đô thị</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h3 className={cx('sub-title')}>Lịch sử hình thành</h3>
                                    <div className={cx('timeline')}>
                                        {HISTORY_TIMELINE.map((item, idx) => (
                                            <div key={idx} className={cx('timeline-item')}>
                                                <div className={cx('timeline-year')}>{item.year}</div>
                                                <div className={cx('timeline-dot')} />
                                                <div className={cx('timeline-card')}>
                                                    <h4>{item.event}</h4>
                                                    <p>{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'cong-bo' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>CÔNG BỐ THÔNG TIN DOANH NGHIỆP</h2>
                                    <div className={cx('disclosure-list')}>
                                        {[
                                            'Báo cáo mục tiêu tổng quát và kế hoạch sản xuất kinh doanh năm 2025',
                                            'Báo cáo thực trạng quản trị và cơ cấu tổ chức doanh nghiệp năm 2024',
                                            'Báo cáo kết quả thực hiện các nhiệm vụ công ích và trách nhiệm xã hội năm 2024',
                                            'Chiến lược phát triển doanh nghiệp đến năm 2030',
                                            'Báo cáo tài chính đã được kiểm toán hàng năm'
                                        ].map((item, idx) => (
                                            <div key={idx} className={cx('disclosure-item')}>
                                                <FaFileContract />
                                                <span>{item}</span>
                                                <button className={cx('view-btn')}>Xem chi tiết</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'lien-he' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>THÔNG TIN LIÊN HỆ</h2>
                                    <div className={cx('contact-wrapper')}>
                                        <div className={cx('contact-detail-list')}>
                                            <ul>
                                                <li><strong>Công ty TNHH Đường Sắt Hà Nội</strong></li>
                                                <li><strong>Địa chỉ:</strong> Số 8 Hồ Xuân Hương, Hai Bà Trưng, Hà Nội</li>
                                                <li><strong>Tel:</strong> (024) 3855.3388</li>
                                                <li><strong>Email:</strong> hmc@metrohanoi.vn; vthanoimetro@gmail.com</li>
                                                <li><strong>Hotline:</strong> 1900.1086</li>
                                            </ul>
                                        </div>

                                        {submitted ? (
                                            <div className={cx('success-message')}>
                                                <FaAward />
                                                <h3>Cảm ơn bạn đã liên hệ!</h3>
                                                <p>Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                                            </div>
                                        ) : (
                                            <form className={cx('contact-form')} onSubmit={handleSubmit}>
                                                <div className={cx('form-group')}>
                                                    <label>Họ Tên *</label>
                                                    <input
                                                        type="text"
                                                        name="customerName"
                                                        value={formData.customerName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className={cx('form-group')}>
                                                    <label>Địa chỉ email *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className={cx('form-group')}>
                                                    <label>Điện thoại *</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className={cx('form-group')}>
                                                    <label>Lời nhắn *</label>
                                                    <textarea
                                                        name="content"
                                                        value={formData.content}
                                                        onChange={handleInputChange}
                                                        rows="6"
                                                        required
                                                    ></textarea>
                                                </div>
                                                <button type="submit" className={cx('submit-btn')} disabled={submitting}>
                                                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'so-do' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>SƠ ĐỒ TỔ CHỨC</h2>
                                    <div className={cx('org-chart-img-container')}>
                                        <img src={orgChartImg} alt="Sơ đồ tổ chức Hanoi Metro" className={cx('org-img')} />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'tam-nhin' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>TẦM NHÌN - SỨ MỆNH</h2>
                                    <div className={cx('mission-vision')}>
                                        <div className={cx('mv-card', 'mission')}>
                                            <div className={cx('card-header')}>
                                                <FaBullseye />
                                                <h3>Sứ mệnh</h3>
                                            </div>
                                            <p>Là doanh nghiệp chủ lực của Hà Nội trong vận tải hành khách công cộng của Thủ đô, góp phần giảm ùn tắc giao thông, mang đến cho người dân một dịch vụ vận tải công cộng an toàn, văn minh, chất lượng và thân thiện với môi trường.</p>
                                        </div>
                                        <div className={cx('mv-card', 'vision')}>
                                            <div className={cx('card-header')}>
                                                <FaEye />
                                                <h3>Tầm nhìn</h3>
                                            </div>
                                            <p>Phấn đấu trở thành doanh nghiệp hàng đầu của Thủ đô trong lĩnh vực giao thông công cộng tốc độ nhanh khối lớn (MRT) và là thương hiệu vận tải đường sắt đô thị hàng đầu Việt Nam.</p>
                                        </div>
                                    </div>
                                    <h3 className={cx('sub-title')}>Giá trị cốt lõi</h3>
                                    <div className={cx('values-list')}>
                                        {CORE_VALUES.map((val, idx) => (
                                            <div key={idx} className={cx('val-item')}>
                                                <div className={cx('val-icon')}>{val.icon}</div>
                                                <div className={cx('val-info')}>
                                                    <h4>{val.title}</h4>
                                                    <p>{val.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'quy-che' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>QUYẾT ĐỊNH – QUY CHẾ CÔNG TY</h2>
                                    <div className={cx('regulations-table')}>
                                        {[
                                            'Quy chế công bố thông tin Công ty',
                                            'Quy định quản lý, cấp phát, sử dụng đồng phục',
                                            'Quy chế phát ngôn và cung cấp thông tin cho báo chí',
                                            'Quy chế hoạt động của Hội đồng Khoa học và Công nghệ',
                                            'Quy định về vận hành hệ thống công nghệ thông tin'
                                        ].map((reg, idx) => (
                                            <div key={idx} className={cx('reg-row')}>
                                                <span className={cx('reg-index')}>{idx + 1}</span>
                                                <span className={cx('reg-name')}>{reg}</span>
                                                <button className={cx('download-btn')}>Tải file</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'bieu-tuong' && (
                                <div className={cx('section-content')}>
                                    <h2 className={cx('section-title')}>Ý NGHĨA BIỂU TƯỢNG</h2>
                                    <div className={cx('logo-meaning')}>
                                        <div className={cx('meaning-block')}>
                                            <h4>Màu sắc</h4>
                                            <ul>
                                                <li><strong>Xanh lá:</strong> Đại diện cho giao thông xanh, thân thiện môi trường và sự phát triển bền vững.</li>
                                                <li><strong>Đỏ:</strong> Tượng trưng cho sự thịnh vượng, may mắn và màu cờ Tổ quốc.</li>
                                                <li><strong>Vàng:</strong> Ngôi sao vàng đại diện cho trí tuệ và tinh thần sáng tạo của con người Việt Nam.</li>
                                            </ul>
                                        </div>
                                        <div className={cx('meaning-block')}>
                                            <h4>Hình thức</h4>
                                            <ul>
                                                <li><strong>Chữ M:</strong> Đặc trưng cho loại hình đường sắt đô thị (Metro).</li>
                                                <li><strong>Hai vòng cung:</strong> Đại diện cho hình ảnh hầm metro vững chãi.</li>
                                                <li><strong>Ngôi sao bay lên:</strong> Tượng trưng cho sự hội tụ những giá trị tinh túy nhất của Thủ đô.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
