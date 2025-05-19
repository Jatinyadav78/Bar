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
import Styles from './fir.module.css';

// Mock data for demonstration
const mockData = {
  cards: [
    { status: 'report', count: 12 },
    { status: 'pending', count: 4 },
    { status: 'approved', count: 6 },
    { status: 'rejected', count: 1 },
    { status: 'closed', count: 8 },
  ],
  graphData: {
    xdata: ['Fire Incident', 'Equipment Failure', 'Safety Breach', 'Near Miss'],
    activeData: [6, 4, 8, 3],
    closedData: [4, 2, 5, 2]
  },
  recentRequests: [
    {
      permitNumber: 'FIR-2024-001',
      status: 'pending',
      formDetail: { formName: 'Fire Incident Report' },
      vendorDetail: { name: 'Jane Doe' },
      createdAt: new Date().toISOString()
    },
    // Add more mock requests as needed
  ]
};

const FIRDashboard = () => {
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
    router.push(`/fir-status/${title}`);
  };

  const handleAddReport = () => {
    router.push('/fir/new');
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
                onClick={handleAddReport}
              >
                New Report
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
              <div className={Styles.graphTitle}>Incident Reports Overview</div>
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
                <div className={Styles.recentReqTitle}>Recent Reports</div>
                <div className={Styles.request}>
                  {loading ? 
                    <RequestSkeleton /> : 
                    requestData.length === 0 ? 
                      <NotFound /> : 
                      requestData.map((data, index) => (
                        <Request 
                          key={index} 
                          data={data} 
                          handleOnClick={(permitNumber) => router.push(`/fir-status/${permitNumber}`)} 
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

export default FIRDashboard;