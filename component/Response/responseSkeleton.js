import React from 'react'
import { Skeleton } from '@mui/material'

const ResponseSkeleton = () => {
  return (
    <>
    <Skeleton variant='rounded' animation='wave'  style={{height:'55px',marginBottom:'10px'}}/>
    <Skeleton variant='rounded' animation='wave' style={{height:'55px',marginBottom:'10px'}} />
    <Skeleton variant='rounded' animation='wave' style={{height:'55px',marginBottom:'10px'}} />
    <Skeleton variant='rounded' animation='wave' style={{height:'55px',marginBottom:'10px'}} />
    <Skeleton variant='rounded' animation='wave' style={{height:'55px',marginBottom:'10px'}} />
    <Skeleton variant='rounded' animation='wave' style={{height:'55px',marginBottom:'10px'}} />
    </>
  )
}

export default ResponseSkeleton