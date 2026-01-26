import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './Auth/Login/LoginModal';
import classNames from 'classnames/bind';
import styles from './AuthModals.module.scss';

// Placeholder for other modals
const RegisterPlaceholder = () => <div>Register Modal Placeholder</div>;
const ForgotPasswordPlaceholder = () => <div>Forgot Password Placeholder</div>;

const cx = classNames.bind(styles);

export default function AuthModals() {
    const {
        authModalOpen,
        authStep,
        closeAuthModal,
    } = useAuth();

    if (!authModalOpen) return null;

    return (
        <div className={cx('auth-modal-overlay')} onClick={(e) => {
            if (e.target === e.currentTarget) closeAuthModal();
        }}>
            <div className={cx('auth-modal-content')}>
                {authStep === 'login' && (
                    <LoginModal
                        open={true}
                        onClose={closeAuthModal}
                    />
                )}
                {/* Other steps can be added here as needed */}
                {authStep === 'register' && <RegisterPlaceholder />}
                {authStep === 'forgot-password' && <ForgotPasswordPlaceholder />}
            </div>
        </div>
    );
}
