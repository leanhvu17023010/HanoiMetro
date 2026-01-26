import EmployeesSideBar from '../EmployeesSideBar';

const menuItems = [
    { label: 'Trang chủ Nhân viên', path: '/staff' },
    { label: 'Quản lý Tuyến/Nhà ga', path: '/staff/products' },
    { label: 'Quản lý Tin tức', path: '/staff/content' },
    { label: 'Quản lý Vé/Đơn hàng', path: '/staff/orders' },
    { label: 'Quản lý Ưu đãi', path: '/staff/vouchers' },
    { label: 'Thông báo', path: '/staff/notifications' },
    { label: 'Hồ sơ cá nhân', path: '/staff/profile' },
];

export default function StaffSideBar() {
    return (
        <EmployeesSideBar
            title="NHÂN VIÊN METRO"
            homePath="/staff/profile"
            menuItems={menuItems}
            roleDisplay={(role) => (role === 'STAFF' ? 'Nhân viên vận hành' : role)}
        />
    );
}
