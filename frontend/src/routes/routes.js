import Home from '../pages/Home';
import Contact from '../pages/Contact';
import CustomerService from '../pages/CustomerService';
import SupportUserPage from '../pages/SupportUser';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';

// Admin Pages
import ManageStaffAccountsPage from '../pages/Admin/ManageStaffAccounts';
import AddEmployeePage from '../pages/Admin/ManageStaffAccounts/AddEmployee';
import StaffDetailPage from '../pages/Admin/ManageStaffAccounts/StaffDetail';
import ManageCustomerAccountsPage from '../pages/Admin/ManageCustomerAccounts';
import CustomerDetailPage from '../pages/Admin/ManageCustomerAccounts/CustomerDetail';
import ManageProductsPage from '../pages/Admin/ManageProduct';
import AdminProductDetailPage from '../pages/Admin/ManageProduct/ProductDetail';
import UpdateProductPage from '../pages/Admin/ManageProduct/UpdateProduct';
import ManageCategoriesPage from '../pages/Admin/ManageCategories';
import AddCategoryPage from '../pages/Admin/ManageCategories/AddCategory';
import CategoryDetailPage from '../pages/Admin/ManageCategories/CategoryDetail';
import UpdateCategoryPage from '../pages/Admin/ManageCategories/UpdateCategory';
import ManageOrdersPage from '../pages/Admin/ManageOrders';
import ManageOrderDetailPage from '../pages/Admin/ManageOrders/ManageOrderDetail';
import OrderReturnPage from '../pages/Admin/ManageOrders/OrderReturn';
import ManageVouchersPromotionsPage from '../pages/Admin/ManageVouchersPromotions';
import VoucherDetailPage from '../pages/Admin/ManageVouchersPromotions/VoucherDetail';
import PromotionDetailPage from '../pages/Admin/ManageVouchersPromotions/PromotionDetail';
import ManageComplaintsPage from '../pages/Admin/ManageComplaints';
import ComplaintsDetailPage from '../pages/Admin/ManageComplaints/ComplaintsDetail';
import ManageContentPage from '../pages/Admin/ManageContent';
import ReportsAnalyticsPage from '../pages/Admin/ReportsAnalytics';

// Staff Pages
import StaffMainPage from '../pages/Staff/StaffMain';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/contact', component: Contact },
    { path: '/support', component: CustomerService },
    { path: '/support/user', component: SupportUserPage },
];

// Private routes
const privateRoutes = [
    // Admin Routes
    { path: '/admin', component: ManageStaffAccountsPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/add-employee', component: AddEmployeePage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/staff/:id', component: StaffDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/customer-accounts', component: ManageCustomerAccountsPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/customers/:id', component: CustomerDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/products', component: ManageProductsPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/products/:id', component: AdminProductDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/products/:id/update', component: UpdateProductPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/categories', component: ManageCategoriesPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/categories/new', component: AddCategoryPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/categories/:id', component: CategoryDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/categories/:id/update', component: UpdateCategoryPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/orders', component: ManageOrdersPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/orders/:id', component: ManageOrderDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/orders/:id/return', component: OrderReturnPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/vouchers-promotions', component: ManageVouchersPromotionsPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/vouchers/:id', component: VoucherDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/promotions/:id', component: PromotionDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/complaints', component: ManageComplaintsPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/complaints/:id', component: ComplaintsDetailPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/content', component: ManageContentPage, layout: AdminLayout, requiredRole: 'ADMIN' },
    { path: '/admin/reports', component: ReportsAnalyticsPage, layout: AdminLayout, requiredRole: 'ADMIN' },

    // Staff Routes
    { path: '/staff', component: StaffMainPage, layout: StaffLayout, requiredRole: 'STAFF' },
];

export { publicRoutes, privateRoutes };
