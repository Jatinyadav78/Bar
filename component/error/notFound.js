'use client'
import React from 'react'
import Image from 'next/image'
import error from '../../public/notFoundError.svg'

const NotFound = () => {
  return (
    <div style={{display:'flex',justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}}>
        <Image 
            src={error}
            style={{width:'100%', height:'100%'}}
        />
    </div>
  )
}

export default NotFound