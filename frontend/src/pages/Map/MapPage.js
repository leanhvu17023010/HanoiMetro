import React from 'react';
import classNames from 'classnames/bind';
import MetroLineMap from '../../components/Home/MetroLineMap/MetroLineMap';
import styles from './MapPage.module.scss';

const cx = classNames.bind(styles);

function MapPage() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <h1>Hệ thống Tuyến đường sắt đô thị Hà Nội</h1>
                    <p>Tra cứu lộ trình, các nhà ga và thông tin vận hành các tuyến Metro tại Hà Nội</p>
                </header>

                <main className={cx('main-content')}>
                    <MetroLineMap />
                </main>

                <section className={cx('info-section')}>
                    <div className={cx('info-card')}>
                        <h3>Tuyến số 2A: Cát Linh - Hà Đông</h3>
                        <p>Dài 13,05 km, gồm 12 ga trên cao. Thời gian đi toàn tuyến khoảng 23 phút.</p>
                    </div>
                    <div className={cx('info-card')}>
                        <h3>Tuyến số 3: Nhổn - Ga Hà Nội</h3>
                        <p>Đoạn trên cao dài 8,5 km từ Nhổn đến Cầu Giấy (8 ga). Đoạn ngầm dài 4 km (4 ga).</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MapPage;
