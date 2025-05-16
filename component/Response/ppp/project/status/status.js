import React from 'react'
import Styles from './status.module.css';
import Button from '../ui/statusButton/button.js'
import { formatDate } from '../../helperFunction/dateTimeFormat.js';

const Status = ({ title, details, status, email, statusChangeAt, isMandatory }) => {
  const date = formatDate(statusChangeAt, true);
  return (
    <div className={Styles.statusContainer}>
      <div className={Styles.stepContainer}>
        <div className={Styles.statusStep}>
          <div className={Styles.dotContainer}>
            <div className={status === 'approved' ? Styles.activeBigDot : status === 'rejected' ? Styles.rejectedBigDot : status === 'closed' ? Styles.closedBigDot : Styles.bigDot}>
              <div className={status === 'approved' ? Styles.activeDot : status === 'rejected' ? Styles.rejectedDot : status === 'closed' ? Styles.closedDot : Styles.dot} />
            </div>
          </div>
          <div className={Styles.title}>
            {title}
            {isMandatory && (
              <span className={Styles.mandatoryBadge}>Approval Required</span>
            )}
          </div>

        </div>
        <div>
          <Button status={status} />
        </div>
      </div>
      <div className={status === 'approved' ? Styles.activeDetailsContainer : status === 'rejected' ? Styles.rejectedDetailsContainer : status === 'closed' ? Styles.closedDetailsContainer : Styles.detailsContainer}>
        <div className={Styles.details}>
          <span style={{ fontWeight: 'bold' }}>Email</span> : {email}
        </div>
        {statusChangeAt && <div className={Styles.details}>
          <span style={{ fontWeight: 'bold' }}>Updated At</span> : <span>{date}</span>
        </div>}
        <div className={Styles.details}>
          <span style={{ fontWeight: 'bold' }}>Remark</span> : {details ? details : 'Await further communication regarding the decision'}
        </div>
      </div>
    </div>
  )
}

export default Status