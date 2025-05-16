import React from 'react';
import Image from 'next/image';
import finishedIcon from '../../public/finished.svg'
import Styles from './permit.module.css';
import Link from 'next/link';

const Permit = ({permitNumber,heading, title}) => {
  return (
    <div className={Styles.imageContainer}>
      <Image
        priority
        src={finishedIcon}
        width={300}
        alt="submitted"
      />
      <div style={{textAlign:'center'}}>
          {heading && <h1>{heading}</h1>}
          {title && <p>{title}</p>}
          <Link style={{color:'green'}} href={`/status/${permitNumber}`}>Check status</Link>
      </div>
    </div>
  )
}

export default Permit