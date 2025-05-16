import React from 'react';
import Styles from './request.module.css';
import { formatDate } from '../../helperFunction/dateTimeFormat.js';
import Skeleton from '@mui/material/Skeleton';

const RequestSkeleton = ({ data, handleOnClick }) => {
    const date = formatDate(data?.createdAt, true)
    return (
        <>
        <Skeleton variant="rectangular" animation='wave' height={60} className={Styles.requestSkeleton}  />
        <Skeleton variant="rectangular" animation='wave' height={60} className={Styles.requestSkeleton}  />
        <Skeleton variant="rectangular" animation='wave' height={60} className={Styles.requestSkeleton}  />
        <Skeleton variant="rectangular" animation='wave' height={60} className={Styles.requestSkeleton}  />
        <Skeleton variant="rectangular" animation='wave' height={60} className={Styles.requestSkeleton}  />
        <Skeleton variant="rectangular" animation='wave' height={60} className={Styles.requestSkeleton}  />
        </>
    )
}

export default RequestSkeleton