import StaffHeader from '../components/Header/Staff/StaffHeader';
import StaffSideBar from '../components/SideBar/Employees/Staff/StaffSideBar';

function StaffLayout({ children }) {
    return (
        <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
            <StaffHeader />
            <div
                className="container"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '260px 1fr',
                    minHeight: 'calc(100vh - 71px)'
                }}
            >
                <aside>
                    <StaffSideBar />
                </aside>
                <main className="content" style={{ padding: '30px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default StaffLayout;
