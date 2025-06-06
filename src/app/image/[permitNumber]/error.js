'use client' // Error components must be Client Components

import { Button } from '@mui/material'
import { useEffect } from 'react'

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className='d-flex flex-column align-items-center justify-content-center' style={{height:'50vh'}}>
            <h2>Something went wrong!</h2>
            <Button
                variant='contained'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}