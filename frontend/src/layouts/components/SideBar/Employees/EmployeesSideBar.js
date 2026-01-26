import classNames from 'classnames/bind';
import styles from './EmployeesSideBar.module.scss';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import avatarFallback from '../../../../assets/icons/icon_defaultAva.png';
import { useEffect, useState, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getMyInfo } from '../../../../services/api';

const cx = classNames.bind(styles);

export default function EmployeesSideBar({ title, homePath, menuItems, roleDisplay }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [displayName] = useLocalStorage('displayName', null);
    const [profile, setProfile] = useState({
        name: displayName || 'Người dùng',
        role: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            try {
                const userData = await getMyInfo(token);
                if (userData) {
                    const rawRole = userData?.role?.name || userData?.role;
                    const role = roleDisplay ? roleDisplay(rawRole) : rawRole;
                    const name = userData?.fullName || userData?.username || displayName || 'Người dùng';
                    setProfile({ name, role });
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        fetchProfile();
    }, [displayName, roleDisplay]);

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className={cx('side')}>
            <div className={cx('panel-title')}>{title}</div>
            <div className={cx('profile')} onClick={() => navigate(homePath)}>
                <img src={avatarFallback} alt="avatar" className={cx('avatar')} />
                <div className={cx('info')}>
                    <div className={cx('name')}>{profile.name}</div>
                    <div className={cx('role')}>{profile.role}</div>
                </div>
            </div>
            <ul className={cx('menu')}>
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={cx('link', { active: isActive(item.path) })}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
