import classNames from 'classnames/bind';
import styles from './AdminSideBar.module.scss';
import adminHeaderStyles from '../../Header/Admin/AdminHeader.module.scss';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const cxModal = classNames.bind(adminHeaderStyles);

export default function AdminSideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [token, setToken, removeToken] = useLocalStorage('token', null);
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage(
        'refreshToken',
        null,
    );
    const [displayName, setDisplayName, removeDisplayName] = useLocalStorage(
        'displayName',
        null,
    );

    // Check if current path is related to staff management
    const isStaffManagementActive =
        location.pathname === '/admin' ||
        location.pathname.startsWith('/admin/add-employee') ||
        location.pathname.startsWith('/admin/staff/');

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        removeToken();
        removeRefreshToken();
        removeDisplayName();
        sessionStorage.removeItem('token');
        navigate('/', { replace: true });
    };

    return (
        <>
            <div className={cx('side')}>
                <div className={cx('panel-title')}>QUẢN TRỊ VIÊN</div>
                <ul className={cx('menu')}>
                    <li>
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                cx('link', {
                                    active: isActive || isStaffManagementActive,
                                })
                            }
                        >
                            Quản lý Nhân viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/customer-accounts"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Khách hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/products"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Tuyến/Nhà ga
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/categories"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Danh mục
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/orders"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Vé/Đơn hàng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/vouchers-promotions"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Ưu đãi
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/complaints"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Khiếu nại
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/content"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Quản lý Tin tức
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/reports"
                            className={({ isActive }) => cx('link', { active: isActive })}
                        >
                            Báo cáo thống kê
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="#"
                            className={cx('link', 'logout')}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowLogoutConfirm(true);
                            }}
                        >
                            Đăng xuất
                        </NavLink>
                    </li>
                </ul>
            </div>
            {showLogoutConfirm && (
                <div className={cxModal('modal-overlay')} role="dialog" aria-modal="true">
                    <div className={cxModal('modal')}>
                        <h3 className={cxModal('modal-title')}>Đăng xuất tài khoản?</h3>
                        <p className={cxModal('modal-desc')}>
                            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                        </p>
                        <div className={cxModal('modal-actions')}>
                            <button
                                className={cxModal('btn', 'btn-muted')}
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className={cxModal('btn', 'btn-primary')}
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
