import React from 'react';
import classNames from 'classnames/bind';
import styles from './SearchAndSort.module.scss';

const cx = classNames.bind(styles);

function SearchAndSort({
    searchPlaceholder = "Tìm kiếm...",
    searchValue,
    onSearchChange,
    onSearchClick,
    dateFilter,
    onDateChange,
    dateLabel = "Ngày",
    sortLabel = "Sắp xếp:",
    sortOptions = [],
    sortValue,
    onSortChange,
    filters = [],
    additionalButtons = []
}) {
    return (
        <div className={cx('search-sort-container')}>
            <div className={cx('search-section')}>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className={cx('search-input')}
                    value={searchValue}
                    onChange={onSearchChange}
                />
                {onDateChange && (
                    <div className={cx('date-input-wrapper')}>
                        <label className={cx('date-label')}>{dateLabel}</label>
                        <input
                            type="date"
                            className={cx('date-input')}
                            value={dateFilter || ''}
                            onChange={(e) => onDateChange(e.target.value)}
                        />
                    </div>
                )}
                <button className={cx('search-btn')} onClick={onSearchClick}>
                    Tìm kiếm
                </button>
            </div>

            {sortOptions.length > 0 && (
                <div className={cx('sort-section')}>
                    {sortLabel && <span className={cx('sort-label')}>{sortLabel}</span>}
                    <select className={cx('sort-dropdown')} value={sortValue} onChange={onSortChange}>
                        {sortOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {filters.map((filter, index) => (
                <div key={index} className={cx('sort-section')}>
                    {filter.label && <span className={cx('sort-label')}>{filter.label}</span>}
                    <select
                        className={cx('sort-dropdown')}
                        value={filter.value}
                        onChange={filter.onChange}
                    >
                        {filter.options.map((option, optIndex) => (
                            <option key={optIndex} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            {additionalButtons.map((button, index) => (
                <button
                    key={index}
                    className={cx('btn', button.className)}
                    onClick={button.onClick}
                >
                    {button.text}
                </button>
            ))}
        </div>
    );
}

export default SearchAndSort;
