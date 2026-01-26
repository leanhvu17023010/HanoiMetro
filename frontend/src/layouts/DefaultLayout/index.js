import { DefaultHeader } from '../components/Header';
import Footer from '../components/Footer';

function DefaultLayout({ children }) {
    return (
        <div>
            <DefaultHeader />
            <div className="main-layout-container">
                <div className="content">{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
