import React from 'react';
import { useNavigate } from 'react-router-dom';

function OrderReturnPage() {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#1d76bb', cursor: 'pointer', fontWeight: 600 }}>← Quay lại</button>
            <h1 style={{ fontSize: '20px', color: '#1d76bb', marginTop: '20px' }}>XỬ LÝ TRẢ VÉ / HOÀN TIỀN</h1>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginTop: '20px' }}>
                <p>Tính năng xử lý trả vé đang được tích hợp...</p>
            </div>
        </div>
    );
}

export default OrderReturnPage;
