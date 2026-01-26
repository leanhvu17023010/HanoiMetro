import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function StaffDashboard() {
    const { logout } = useAuth();

    return (
        <div style={{ padding: '100px 40px', minHeight: '80vh' }}>
            <h1>Bảng điều khiển Nhân viên - Hanoi Metro</h1>
            <p>Chào mừng nhân viên đã quay trở lại. Bạn có thể quản lý lịch trình và hỗ trợ hành khách tại đây.</p>
            <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#1d76bb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Đăng xuất</button>
        </div>
    );
}

export default StaffDashboard;
