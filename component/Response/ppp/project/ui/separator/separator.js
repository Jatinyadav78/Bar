import React from 'react';
import Styles from './separator.module.css'

const Separator = ({field}) => {
  return (
    <div >
        <hr className={Styles.horizontalLine}/>
    </div>
  )
}

export default Separator