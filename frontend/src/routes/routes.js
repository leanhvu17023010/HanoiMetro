import Home from '../pages/Home';
import Contact from '../pages/Contact';
import CustomerService from '../pages/CustomerService';
import SupportUserPage from '../pages/SupportUser';
import Login from '../components/Auth/Login';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import PrivateRoute from './PrivateRoute';

// Placeholder components for new Metro Hanoi pages
const MetroNetwork = () => <div>Mạng lưới Metro</div>;
const Tickets = () => <div>Thông tin Vé</div>;
const UserGuide = () => <div>Hướng dẫn sử dụng</div>;
const AboutUs = () => <div>Giới thiệu công ty</div>;

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/metro-network', component: MetroNetwork },
    { path: '/afc-tickets', component: Tickets },
    { path: '/metro-userguide', component: UserGuide },
    { path: '/about-us', component: AboutUs },
    { path: '/contact', component: Contact },
    { path: '/support', component: CustomerService },
    { path: '/support/user', component: SupportUserPage },
    { path: '/login', component: Login },
    { path: '/admin', component: AdminDashboard },
];

// Private routes (Empty as Metro Hanoi is public informational)
const privateRoutes = [];

export { publicRoutes, privateRoutes };
