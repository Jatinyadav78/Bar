import React from 'react';
import Styles from './button.module.css';

const CustomButton = ({status}) => {
    return (
        <div className={status === 'approved' ? Styles.activeStatus : status === 'rejected' ? Styles.rejectedStatus: status === 'closed'? Styles.closedStatus : Styles.status}>
            <p>{status ? status : 'Pending'}</p>
        </div>
    )
}

export default CustomButton