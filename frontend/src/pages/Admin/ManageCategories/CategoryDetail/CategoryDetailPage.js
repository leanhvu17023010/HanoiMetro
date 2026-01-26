import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CategoryDetailPage.module.scss';
import { getCategoryById, updateCategory, deleteCategory, getStoredToken } from '../../../../services';

const cx = classNames.bind(styles);

function CategoryDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const token = getStoredToken();
                const data = await getCategoryById(id, token);
                setCategory(data);
            } catch (e) {
                setError('Không thể tải thông tin danh mục');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className={cx('page')}>Đang tải...</div>;
    if (error || !category) return <div className={cx('page')}><button onClick={() => navigate(-1)}>←</button><p>{error || 'Không tìm thấy'}</p></div>;

    return (
        <div className={cx('page')}>
            <button className={cx('back-btn')} onClick={() => navigate(-1)}>← Quay lại</button>
            <h1 className={cx('title')}>Chi tiết Danh mục / Loại vé</h1>

            <div className={cx('card')}>
                <div className={cx('row')}><span className={cx('label')}>Mã:</span><span>{category.id}</span></div>
                <div className={cx('row')}><span className={cx('label')}>Tên:</span><span className={cx('name')}>{category.name}</span></div>
                <div className={cx('row')}><span className={cx('label')}>Mô tả:</span><span>{category.description || 'Không có mô tả'}</span></div>
                <div className={cx('row')}><span className={cx('label')}>Trạng thái:</span><span>{category.status ? 'Đang hoạt động' : 'Đang ẩn'}</span></div>

                <div className={cx('actions')}>
                    <button className={cx('btn', 'edit')} onClick={() => navigate(`/admin/categories/${id}/update`)}>Chỉnh sửa</button>
                </div>
            </div>
        </div>
    );
}

export default CategoryDetailPage;
