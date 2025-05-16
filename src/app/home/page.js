'use client'
import React from 'react'
import FormPlayground from '../../../component/formPlayground/index.js'
import { Provider } from 'react-redux';
import store from '../../../store/index.js';
import { useSearchParams } from 'next/navigation.js';

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const search = useSearchParams();
  const id = search.get('id')
  const orgId = search.get('orgId');
  const validTill = search.get('till');

  return (
    <Provider store={store}>
        <FormPlayground id={id} orgId={orgId} validTill={validTill}/>
    </Provider >
  )
}

export default page