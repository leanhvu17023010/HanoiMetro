import AdminHeader from '../components/Header/Admin/AdminHeader';
import AdminSideBar from '../components/SideBar/Admin/AdminSideBar';

function AdminLayout({ children }) {
    return (
        <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
            <AdminHeader />
            <div
                className="container"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '260px 1fr',
                    minHeight: 'calc(100vh - 71px)'
                }}
            >
                <aside>
                    <AdminSideBar />
                </aside>
                <main className="content" style={{ padding: '30px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
