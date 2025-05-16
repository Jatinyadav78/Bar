import React, { useState } from 'react';
import Styles from './request.module.css';
import CustomButton from '../ui/statusButton/button.js';
import { formatDate } from '../../helperFunction/dateTimeFormat.js';
import { Button } from '@mui/material';
import CameraAltTwoToneIcon from '@mui/icons-material/CameraAltTwoTone';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const Request = ({ data, handleOnClick, handleAddImage }) => {
  // Add loading state for request click
  const [isLoading, setIsLoading] = useState(false);
  const date = formatDate(data?.createdAt, true)

  // Handle request click with loading state
  const handleRequestClick = async () => {
    setIsLoading(true);
    await handleOnClick(data?.permitNumber, data?.status);
    // setIsLoading(false); 
  };
    
  return (
    <div>
      <div className={Styles.requestContainer} onClick={handleRequestClick}>
        <div className={Styles.details}>
          <div className={Styles.name}>
            <div className={Styles.permitInfo}>
              <div>
                <span className={Styles.permitType}>{data?.formDetail?.formName}</span>
                <div className={Styles.permitId}>Permit No: {data?.permitNumber}</div>
              </div>
              <span className={Styles.personName}>({data?.vendorDetail?.name})</span>
            </div>
          </div>
          <div className={Styles.otherDetails}>
            <p className={Styles.timestamp}>{date}</p>
            {data?.personName && <p>{`${data?.personName}(${data?.PersonDesignation})`}</p>}
            {data?.remark && <p className={Styles.remark}>{data?.remark}</p>}
          </div>
        </div>
        {data?.extension?.status === 'pending' && !(data?.status === 'closed') && 
          <div className={Styles.extAlert}>
            <WatchLaterOutlinedIcon fontSize='small'/> 
            <span>Extension</span>
          </div>
        }
        <div className={Styles.pendingContainer}>
          {isLoading ? (
            <CircularProgress size={24} style={{ color: '#0073FF' }} />
          ) : (
            <CustomButton status={data?.status} />
          )}
        </div>
      </div>
      <div style={{ width: '100%',marginLeft: '15px' }}>
        {data?.state === 'approved' && 
          <Button
            className={Styles.imageButton}
            variant='contained'
            endIcon={<CameraAltTwoToneIcon />}
            onClick={() => handleAddImage(data?.permitNumber)}
          >  
            ADD IMAGE
          </Button>
        }
      </div>
    </div>
  )
}

export default Request;
 

// make side bar like the image uploaded and the side bar should be collapsible and the side bar should have the following options:
// 1. Work Permit Dashboard - when clicked on it user will be re directed to the workpermit dashboard that is my main dashboard looks like in the 2nd image 
// this code for work permit already exists as i have uploaded.
// Now i am want two more dashboards the names are:
// 2. Fir Dashboard - when user clicks on it user will be redirected to the fir dashboard that is my new dashboard that i will create and on that dashboard i will show the list of all the firs that are created by the user and the status of the firs.
// 3. Safety audit Report Dashboard - when user clicks on it user will be redirected to the safety dashboard that is my new dashboard that i will create and on that dashboard i will show the list of all the safety requests that are created by the user and the status of the safety requests.