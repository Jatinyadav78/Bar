'use client'
import React, { useEffect, useState } from 'react';
import FirDashboard from '../../../component/dashboardHome/firDashboard';
import { getLocalStorage } from '../../../helperFunction/localStorage';
import { API_URL } from '../../../utils';

const Page = () => {
  const user = getLocalStorage('user');
  const [firData, setFirData] = useState([]);
  const orgId = user?.organizationId;
  const fetchFirData = async () => {
    const response = await fetch(`${API_URL}/v1/safety/incidence?orgId=${orgId}`);
    const data = await response.json();
    setFirData(data);
  }

  useEffect(() => {
    fetchFirData();
  }, []);
  return (
    <FirDashboard data={firData} />
  )
}

export default Page