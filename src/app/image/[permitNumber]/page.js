'use client'
import React from 'react'
import Camera from '../../../../component/ui/capturedWithCamera/camera.js'

const page = ({params}) => {
  return (<>
    <div style={{padding:'15px'}}>
      <Camera permitNumber={params.permitNumber} />
    </div>
  </>
  )
}

export default page