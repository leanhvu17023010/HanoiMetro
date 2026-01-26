import { Fragment } from 'react/jsx-runtime';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import PrivateRoute from './routes/PrivateRoute';
import DefaultLayout from './layouts/DefaultLayout';
import NotificationProvider from './components/Common/Notification';

import { AuthProvider } from './contexts/AuthContext';
import AuthModals from './components/AuthModals';

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <AuthModals />
                    <div className="App">
                        <Routes>
                            {/* Public Routes */}
                            {publicRoutes.map((route, index) => {
                                const Page = route.component;
                                let Layout = DefaultLayout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                            {/* Private Routes */}
                            {privateRoutes.map((route, index) => {
                                const Page = route.component;
                                let Layout = DefaultLayout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <PrivateRoute requiredRole={route.requiredRole}>
                                                <Layout>
                                                    <Page />
                                                </Layout>
                                            </PrivateRoute>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </div>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
