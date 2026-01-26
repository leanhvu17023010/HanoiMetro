import React from 'react';
import classNames from 'classnames/bind';
import styles from './DeleteAccountDialog.module.scss';

const cx = classNames.bind(styles);

function DeleteAccountDialog({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className={cx('overlay')}>
            <div className={cx('modal')}>
                <h3 className={cx('title')}>{title}</h3>
                <p className={cx('message')}>{message}</p>
                <div className={cx('actions')}>
                    <button className={cx('btn', 'cancel')} onClick={onCancel}>Hủy bỏ</button>
                    <button className={cx('btn', 'confirm')} onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccountDialog;
