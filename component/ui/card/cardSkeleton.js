import React from 'react';
import Styles from './card.module.css';
import { Skeleton } from '@mui/material';

const CardSkeleton = () => {
       return (
        <>
        <Skeleton animation='wave' height={100} className={`${Styles.cardSkeleton}`}/>
        </>
    )
}

export default CardSkeleton