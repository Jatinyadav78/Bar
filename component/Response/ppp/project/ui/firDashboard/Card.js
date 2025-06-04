import React, { useState } from 'react';
import Styles from './Card.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import requestIcon from '../../../public/request.svg';
import pendingIcon from '../../../public/pending.svg';
import approvedIcon from '../../../public/approved.svg';
import rejectedIcon from '../../../public/rejected.svg';
import closedIcon from '../../../public/closed.svg';

const Card = ({ title, number, handleClick }) => {
    const [isLoading, setIsLoading] = useState(false);
    const Icon = title === 'request' ? requestIcon : 
                 title === 'pending' ? pendingIcon : 
                 title === 'approved' ? approvedIcon : 
                 title === 'rejected' ? rejectedIcon : 
                 title === 'closed' ? closedIcon : '';
   
    const getCardStyle = (title) => {
        switch(title) {
            case 'open':
                return { background: '#FF6F061A', color: '#FF6F06' };
            case 'captured':
                return { background: '#16B9611A', color: '#16B961' };
            case 'pending':
                return { background: '#0073FF33', color: '#0073FF' };
            default:
                return { background: '#0073FF33', color: '#0073FF' };
        }
    };

    const handleCardClick = async () => {
        setIsLoading(true);
        await handleClick(title);
    };

    const cardStyle = getCardStyle(title);

    return (
        <div 
            className={Styles.cardContainer} 
            style={{ background: cardStyle.background }}
            onClick={handleCardClick}
        >
            <div className={Styles.cardContent}>
                <div className={Styles.iconContainer} style={{ background: 'white' }}>
                    {isLoading ? (
                        <CircularProgress size={40} style={{ color: cardStyle.color }} />
                    ) : (
                        <Image
                            priority
                            src={Icon}
                            width={40}
                            height={40}
                            alt={title}
                        />
                    )}
                </div>
                <div className={Styles.textContainer}>
                    <h3 className={Styles.title} style={{ color: cardStyle.color }}>
                        {title}
                    </h3>
                    <span className={Styles.number} style={{ color: cardStyle.color }}>
                        {number}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Card;