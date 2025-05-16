'use client'
import React from 'react';
import Index from '../../../../component/request/index.js'
// import {useRouter} from 'next/router'

const Page = ({ params }) => {
    const arr = ['request', 'pending', 'approved', 'rejected', 'closed']
    const url = params.slug;
    const status =  arr.includes(url[0]) && url[0];
    const permitNumber = !arr.includes(url[0])?  url[0]: url[1];
    // const router = useRouter();
    // const {tilte} = router.query;
    
    return (
        <>
            <Index status={status} pn={permitNumber} />
        </>
    )
}

export default Page