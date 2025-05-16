'use client'
import React from 'react'
import QRCodeScanner from '../../../component/QRCode/QRCodeScanner'

const page = () => {
  return (
    <div style={{width:'100vw', height:'100vh'}}>
        <QRCodeScanner />
    </div>
  )
}

export default page