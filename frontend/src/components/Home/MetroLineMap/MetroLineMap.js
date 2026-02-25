import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MetroLineMap.module.scss';

const cx = classNames.bind(styles);

const LINE_2A_STATIONS = [
    { id: '1', name: 'Cát Linh (trung chuyển)', isUnderground: false },
    { id: '2', name: 'La Thành', isUnderground: false },
    { id: '3', name: 'Thái Hà', isUnderground: false },
    { id: '4', name: 'Láng', isUnderground: false },
    { id: '5', name: 'Thượng Đình', isUnderground: false },
    { id: '6', name: 'Vành Đai 3', isUnderground: false },
    { id: '7', name: 'Phùng Khoang', isUnderground: false },
    { id: '8', name: 'Văn Quán', isUnderground: false },
    { id: '9', name: 'Hà Đông', isUnderground: false },
    { id: '10', name: 'La Khê', isUnderground: false },
    { id: '11', name: 'Văn Khê', isUnderground: false },
    { id: '12', name: 'Yên Nghĩa', isUnderground: false },
];

const LINE_3_STATIONS = [
    { id: '1', name: 'Nhổn', isUnderground: false },
    { id: '2', name: 'Minh Khai', isUnderground: false },
    { id: '3', name: 'Phú Diễn', isUnderground: false },
    { id: '4', name: 'Cầu Diễn', isUnderground: false },
    { id: '5', name: 'Lê Đức Thọ', isUnderground: false },
    { id: '6', name: 'ĐH Quốc gia Hà Nội', isUnderground: false },
    { id: '7', name: 'Chùa Hà', isUnderground: false },
    { id: '8', name: 'Cầu Giấy', isUnderground: false },
    { id: '9', name: 'Kim Mã', isUnderground: true },
    { id: '10', name: 'Cát Linh (trung chuyển)', isUnderground: true },
    { id: '11', name: 'Văn Miếu', isUnderground: true },
    { id: '12', name: 'Ga Hà Nội', isUnderground: true },
];

function MetroLineMap({ activeTab }) {
    const renderMap = (stations, color, lineName) => (
        <div className={cx('map-view')}>
            <div className={cx('line-header')}>
                <div className={cx('line-badge', `line-${activeTab}`)}>
                    {activeTab === '2A' ? 'C' : 'V'}
                </div>
                <div className={cx('line-info')}>
                    <h3>Tuyến {lineName}</h3>
                </div>
            </div>

            <div className={cx('station-diagram')}>
                <div className={cx('diagram-title')}>Sơ đồ nhà ga</div>
                <div className={cx('stations-container')}>
                    <div className={cx('connecting-line')} style={{ backgroundColor: color }} />
                    {stations.map((station, index) => (
                        <div key={station.id} className={cx('station-item')}>
                            <div
                                className={cx('station-circle', { underground: station.isUnderground })}
                                style={{ borderColor: color, color: station.isUnderground ? '#fff' : color, backgroundColor: station.isUnderground ? color : '#fff' }}
                            >
                                {station.id}
                            </div>
                            <div className={cx('station-name')}>{station.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={cx('legend-and-time')}>
                <div className={cx('time-info')}>
                    <div className={cx('time-label')}>Thời gian tàu chạy</div>
                    <div className={cx('time-value')}>05:30 - 22:00</div>
                </div>
                <div className={cx('legend')}>
                    <div className={cx('legend-item')}>
                        <span className={cx('legend-box', 'box-elevated')} />
                        <span>Ga trên cao</span>
                    </div>
                    <div className={cx('legend-item')}>
                        <span className={cx('legend-box', 'box-underground', `bg-${activeTab}`)} style={{ backgroundColor: color }} />
                        <span>Ga ngầm</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {activeTab === '2A' ? renderMap(LINE_2A_STATIONS, '#bece0a', '2A: Cát Linh - Hà Đông') : null}
                {activeTab === '3' ? renderMap(LINE_3_STATIONS, '#8e3834', '3: Nhổn - Ga Hà Nội') : null}
                {activeTab === 'MAP_14' ? (
                    <div className={cx('pdf-container')}>
                        <iframe
                            src="/0.pdf#toolbar=0"
                            title="Bản đồ quy hoạch 14 tuyến"
                            className={cx('pdf-viewer')}
                        />
                        <div className={cx('pdf-fallback')}>
                            <p>Không thể hiển thị PDF trực tiếp? <a href="/0.pdf" target="_blank" rel="noreferrer">Mở bản đồ trong tab mới</a></p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default MetroLineMap;
