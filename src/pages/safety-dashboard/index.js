import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/layout';
import Card from '../../components/ui/card/card';
import Graph from '../../components/ui/graph/graph';
import Request from '../../components/request/request';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RequestSkeleton from '../../components/request/requestSkeleton';
import CardSkeleton from '../../components/ui/card/cardSkeleton';
import NotFound from '../../components/error/notFound';
import Styles from './safety.module.css';

// Mock data for demonstration
const mockData = {
  cards: [
    { status: 'report', count: 15 },
    { status: 'pending', count: 5 },
    { status: 'approved', count: 8 },
    { status: 'rejected', count: 2 },
    { status: 'closed', count: 10 },
  ],
  graphData: {
    xdata: ['Safety Check', 'Equipment Audit', 'Process Audit', 'Compliance Check'],
    activeData: [8, 12, 5, 9],
    closedData: [5, 8, 3, 7]
  },
  recentRequests: [
    {
      permitNumber: 'SA-2024-001',
      status: 'pending',
      formDetail: { formName: 'Safety Equipment Audit' },
      vendorDetail: { name: 'John Smith' },
      createdAt: new Date().toISOString()
    },
    // Add more mock requests as needed
  ]
};

const SafetyDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(mockData.cards);
  const [requestData, setRequestData] = useState(mockData.recentRequests);
  const [graphData, setGraphData] = useState(mockData.graphData);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleCard = async (title) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/safety-status/${title}`);
  };

  const handleAddAudit = () => {
    router.push('/safety-audit/new');
  };

  return (
    <Layout>
      <div className={Styles.dashboardContainer}>
        <div className={Styles.main}>
          <div className={Styles.header}>
            <div className={Styles.title}></div>
            <div>
              <Button
                variant='contained'
                style={{ backgroundColor: '#0073FF' }}
                startIcon={<AddIcon />}
                onClick={handleAddAudit}
              >
                New Audit
              </Button>
            </div>
          </div>
          
          <div className={`${Styles.card} row-gap-3 mt-2`}>
            {loading ? 
              cardData.map((_, index) => <CardSkeleton key={index} />) : 
              cardData.map((card, index) => (
                <Card key={index} title={card.status} number={card.count} handleClick={handleCard} />
              ))
            }
          </div>

          <div className='row gap-5 mt-4 justify-content-center'>
            <div className={`${Styles.graph} ${Styles.border} col-lg-6`}>
              <div className={Styles.graphTitle}>Safety Audits Overview</div>
              <div>
                <Graph 
                  activeYData={graphData.activeData} 
                  closedYData={graphData.closedData} 
                  xdata={graphData.xdata} 
                />
              </div>
            </div>
            
            <div className={`${Styles.recentRequest} ${Styles.border} col-lg-5`}>
              <div className='w-100'>
                <div className={Styles.recentReqTitle}>Recent Audits</div>
                <div className={Styles.request}>
                  {loading ? 
                    <RequestSkeleton /> : 
                    requestData.length === 0 ? 
                      <NotFound /> : 
                      requestData.map((data, index) => (
                        <Request 
                          key={index} 
                          data={data} 
                          handleOnClick={(permitNumber) => router.push(`/safety-status/${permitNumber}`)} 
                        />
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SafetyDashboard;