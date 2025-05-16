import React, { useState } from 'react';
import Styles from './card.module.css';
import requestIcon from '../../../public/request.svg';
import pendingIcon from '../../../public/pending.svg';
import approvedIcon from '../../../public/approved.svg';
import rejectedIcon from '../../../public/rejected.svg';
import closedIcon from '../../../public/closed.svg'
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

const Card = ({ title, number, handleClick }) => {
    const [isLoading, setIsLoading] = useState(false);
    const Icon = title === 'request' ? requestIcon : title === 'pending' ? pendingIcon : title === 'approved' ? approvedIcon : title === 'rejected' ? rejectedIcon : title === 'closed'? closedIcon :'';
    const backgroundColor = title === 'request' ? '#0073FF33' : title === 'pending' ? '#FF6F061A' : title === 'approved' ? '#16B9611A' : title === 'rejected' ? '#FF0E560D' : title === 'closed'? '#4906B733' : '';

    const handleCardClick = async () => {
        setIsLoading(true);
        await handleClick(title);
    }
 
    return (
        <div className={`${Styles.cardContainer}`} style={{ background: backgroundColor }} onClick={handleCardClick}>
            <div className={Styles.imageTitleContainer}>
                <div className={Styles.imageContainer}>
                    {isLoading ? (
                        <CircularProgress size={40} style={{ color: '#0073FF' }} />
                    ) : (
                        <Image
                            priority
                            src={Icon}
                            width={40}
                            alt="submitted"
                        />
                    )}
                </div>
                <div className={Styles.titleContainer}>{title}</div>
            </div>
            <div className={Styles.numberContainer}>{number}</div>
        </div>
    )
}

export default Card