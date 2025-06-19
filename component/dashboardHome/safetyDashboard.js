"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Styles from './dashboardHome.module.css';
import Image from 'next/image';
import DashboardDesign from '../../public/dashboardDesign.svg';
import requestIcon from '../../public/request.svg';
import pendingIcon from '../../public/pending.svg';
import closedIcon from '../../public/closed.svg';
import notFoundError from '../../public/notFoundError.svg';
import Card from '../ui/card/card.js';
import SafetyGraph from '../ui/graph/safetyGraph.js';
import Request from '../request/request.js';
import { useRouter } from 'next/navigation';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Popover, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { PieChart } from 'react-minimal-pie-chart';
import RequestSkeleton from '../request/requestSkeleton';
import CardSkeleton from '../ui/card/cardSkeleton.js';
import NotFound from '../error/notFound.js';
import { getLocalStorage } from '../../helperFunction/localStorage.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { API_URL } from '../../utils';
import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SafetyDashboard = () => {
  const router = useRouter();
  const user = getLocalStorage('user');
  let fetchUrl = API_URL;
  
  const [safetyCondition, setSafetyCondition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState('1');
  const [graphXdata, setGraphXdata] = useState(['USC', 'USA']);
  const [graphWorkers, setGraphWorkers] = useState([0, 0]);
  const [graphStaff, setGraphStaff] = useState([0, 0]);
  const [areaIncidents, setAreaIncidents] = useState([]);
  const [cardObj, setCardObj] = useState([
    { 
      type: 'USC',
      statuses: [
        { status: 'open', count: 0 },
        { status: 'closed', count: 0 },
        { status: 'pending', count: 0 }
      ]
    },
    { 
      type: 'USA',
      statuses: [
    { status: 'open', count: 0 },
    { status: 'closed', count: 0 },
    { status: 'pending', count: 0 }
      ]
    }
  ]);

  // Update loading state to track both form type and status
  const [loadingStatus, setLoadingStatus] = useState({ formType: null, status: null });

  // Calculate counts from safetyCondition data
  const getCounts = useMemo(() => {
    if (!safetyCondition) return { open: 0, closed: 0, pending: 0 };
    return safetyCondition.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, { open: 0, closed: 0, pending: 0 });
  }, [safetyCondition]);

  // Calculate total counts for USC and USA
  const getTotalCounts = useMemo(() => {
    return {
      uscTotal: (graphWorkers[0] || 0) + (graphStaff[0] || 0),
      usaTotal: (graphWorkers[1] || 0) + (graphStaff[1] || 0),
      totalWorkers: (graphWorkers[0] || 0) + (graphWorkers[1] || 0),
      totalStaff: (graphStaff[0] || 0) + (graphStaff[1] || 0)
    };
  }, [graphWorkers, graphStaff]);

  const fetchSafetyData = async (start = null, end = null) => {
    try {
      const token = getLocalStorage('token')?.access?.token;
      const orgId = user?.organizationId?.[0];
      let url = `${fetchUrl}/v1/safety/safety-condition?orgId=${orgId}`;
      
      if (start) {
        url += `&startDate=${start}`;
      }
      if (end) {
        url += `&endDate=${end}`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch safety data');
      }

      const data = await res.json();
      setSafetyCondition(data);
      
      // Update card counts for USC and USA with their respective status counts
      const uscData = data.filter(item => item.formType === 'USC');
      const usaData = data.filter(item => item.formType === 'USA');

      setCardObj([
        {
          type: 'USC',
          statuses: [
            { status: 'open', count: uscData.filter(item => item.status === 'open').length },
            { status: 'closed', count: uscData.filter(item => item.status === 'closed').length },
            { status: 'pending', count: uscData.filter(item => item.status === 'pending').length }
          ]
        },
        {
          type: 'USA',
          statuses: [
            { status: 'open', count: usaData.filter(item => item.status === 'open').length },
            { status: 'closed', count: usaData.filter(item => item.status === 'closed').length },
            { status: 'pending', count: usaData.filter(item => item.status === 'pending').length }
          ]
        }
      ]);

      // Process area data for pie chart
      const areaCount = data.reduce((acc, item) => {
        if (item.area) {
          acc[item.area] = (acc[item.area] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate percentages and create pie chart data
      const total = Object.values(areaCount).reduce((sum, count) => sum + count, 0);
      const colors = ['#E91E63', '#FF9800', '#9C27B0', '#4CAF50', '#FF5722', '#009688'];
      
      const pieData = Object.entries(areaCount).map(([area, count], index) => ({
        title: area,
        value: Math.round((count / total) * 100),
        color: colors[index % colors.length]
      }));

      setAreaIncidents(pieData);
      
      // Process worker/staff data
      const uscWorkers = data.filter(item => item.formType === 'USC' && item.worker).length;
      const uscStaff = data.filter(item => item.formType === 'USC' && item.staff).length;
      const usaWorkers = data.filter(item => item.formType === 'USA' && item.worker).length;
      const usaStaff = data.filter(item => item.formType === 'USA' && item.staff).length;
      
      setGraphWorkers([uscWorkers, usaWorkers]);
      setGraphStaff([uscStaff, usaStaff]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching safety data:', error);
      setError(true);
      setLoading(false);
    }
  };

  // Fetch safety condition data on mount
  useEffect(() => {
    // Get current month's date range
    const now = dayjs();
    const startOfMonth = now.startOf('month').format('YYYY-MM-DD');
    const currentDate = now.format('YYYY-MM-DD');
    
    // Set the date states
    setStartDate(dayjs(startOfMonth));
    setEndDate(now);
    
    // Fetch data with date range
    fetchSafetyData(startOfMonth, currentDate);
  }, []);

  const handleDateChange = () => {
    if (startDate && endDate) {
      const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
      fetchSafetyData(formattedStartDate, formattedEndDate);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    handleDateChange();
    handleFilterClose();
  };

  const handleCard = async (formType, status) => {
    setLoadingStatus({ formType, status: status.toLowerCase() });
    // Filter conditions based on both formType and status
    const filteredConditions = safetyCondition?.filter(
      item => item.formType === formType && item.status === status.toLowerCase()
    ) || [];
    
    localStorage.setItem('filteredSafetyConditions', JSON.stringify(filteredConditions));
    localStorage.setItem('formType', formType);
    localStorage.setItem('selectedStatus', status.toLowerCase());
    
    const dateFilters = {
      startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
      endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null
    };
    localStorage.setItem('safetyDateFilters', JSON.stringify(dateFilters));
    
    router.push(`/safety-conditions/all`);
  };

  const handleOnClick = (permitNumber, status) => {
    router.push(`/status/${status}/${permitNumber}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSafetyForm = () => {
    const orgId = user?.organizationId;
    const safetyFormId = '682424d7412aa761f4cb8619';
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    const url = `${window.location.origin}/home?id=${safetyFormId}&orgId=${orgId}&till=${expiryDate.toISOString()}`;
    window.open(url, '_blank');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  // Add chart configuration for area incidents
  const areaChartConfig = {
    options: {
      chart: { 
        type: 'pie',
        fontFamily: 'inherit',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          },
          export: {
            csv: {
              filename: 'Major Areas of Incidents',
              columnDelimiter: ',',
              headerCategory: 'Area',
              headerValue: 'Percentage'
            },
            svg: {
              filename: 'Major Areas of Incidents'
            },
            png: {
              filename: 'Major Areas of Incidents'
            }
          },
          position: 'right',
          offsetX: 0,
          offsetY: 0
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      title: { 
        text: 'Major Areas of Incidents',
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'inherit',
          color: '#2c3e50'
        },
        margin: 20
      },
      labels: areaIncidents.map(item => item.title),
      colors: [
        '#4361ee', // Blue
        '#ff9800', // Orange
        '#2ecc71', // Green
        '#e74c3c', // Red
        '#9b59b6', // Purple
        '#3498db'  // Light Blue
      ],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [
            '#6284ff', // Blue gradient
            '#ffc107', // Orange gradient
            '#55e992', // Green gradient
            '#ff6b5d', // Red gradient
            '#c183e8', // Purple gradient
            '#5dafed'  // Light Blue gradient
          ],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 500,
        markers: {
          width: 15,
          height: 15,
          radius: 8,
          offsetX: -3
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8
        },
        labels: {
          colors: '#4a5568'
        },
        onItemHover: {
          highlightDataSeries: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + '%'
        },
        style: {
          fontSize: '16px',
          fontFamily: 'inherit',
          fontWeight: '600',
          colors: ['#fff']
        },
        dropShadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.2)',
          top: 2,
          left: 0,
          blur: 4,
          opacity: 0.35
        },
        textAnchor: 'middle'
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          expandOnClick: true,
          offsetY: 10,
          customScale: 1.02,
          donut: {
            size: '0%'
          }
        }
      },
      stroke: {
        width: 3,
        colors: ['#fff']
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.1
          }
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.35
          }
        }
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: '14px'
        },
        y: {
          formatter: function(val) {
            return val.toFixed(1) + '%'
          }
        },
        theme: 'dark',
        fillSeriesColor: false
      }
    },
    series: areaIncidents.map(item => item.value)
  };

  // Update StatusIcon to use smaller size
  const StatusIcon = ({ status, isLoading }) => {
    if (isLoading) {
      return <CircularProgress size={24} style={{ color: '#0073FF' }} />;
    }

    switch(status.toLowerCase()) {
      case 'open':
        return (
          <Image
            priority
            src={requestIcon}
            width={24}
            height={24}
            alt="open"
          />
        );
      case 'closed':
        return (
          <Image
            priority
            src={closedIcon}
            width={24}
            height={24}
            alt="closed"
          />
        );
      case 'pending':
        return (
          <Image
            priority
            src={pendingIcon}
            width={24}
            height={24}
            alt="pending"
          />
        );
      default:
        return null;
    }
  };

  // Update TypeSection with total count and enhanced hover effects
  const TypeSection = ({ typeData }) => {
    // Calculate total count for the section
    const totalCount = typeData.statuses.reduce((sum, status) => sum + status.count, 0);

    const getStatusColor = (status) => {
      switch(status.toLowerCase()) {
        case 'open':
          return '#0073FF33';
        case 'closed':
          return '#4906B733';
        case 'pending':
          return '#FF6F061A';
        default:
          return '#2196F3';
      }
    };

    return (
      <div className="col-lg-6 mb-3">
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          padding: '12px',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '6px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0
            }}>{typeData.type}</h3>
            <div style={{
              backgroundColor: '#0073FF15',
              padding: '4px 12px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0073FF'
              }}>
                Total: {totalCount}
              </span>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            {typeData.statuses.map((statusData, index) => (
              <div
                key={index}
                onClick={() => handleCard(typeData.type, statusData.status)}
                style={{
                  backgroundColor: getStatusColor(statusData.status),
                  borderRadius: '8px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transform: 'scale(1)',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 2
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.zIndex = '2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.zIndex = '1';
                }}
              >
                <StatusIcon 
                  status={statusData.status} 
                  isLoading={
                    loadingStatus.formType === typeData.type && 
                    loadingStatus.status === statusData.status.toLowerCase()
                  }
                />
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  textTransform: 'capitalize',
                  lineHeight: 1
                }}>
                  {statusData.status}
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  lineHeight: 1
                }}>
                  {statusData.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Image
          src={notFoundError}
          alt="Error"
          width={300}
          height={300}
          priority
        />
        <Typography variant="h5" sx={{ color: '#64748b' }}>
          Something went wrong. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <div className={Styles.dashboardContainer}>
      <Image
        className={Styles.dashboardImage}
        priority
        src={DashboardDesign}
        alt="submitted"
      />
      <div className={Styles.main}>
        <div className={Styles.header}>
          <div className={Styles.title}></div>
          <div className={Styles.headerControls} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              style={{ backgroundColor: '#0073FF' }}
            >
              Filter
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={{ p: 2, width: '300px' }}>
                <Stack spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        fetchSafetyData();
                        handleFilterClose();
                      }}
                      fullWidth
                      color="error"
                    >
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleApplyFilter}
                      fullWidth
                      style={{ backgroundColor: '#0073FF' }}
                    >
                      Apply Filter
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Popover>
            <Button
              variant='contained'
              style={{ backgroundColor: '#0073FF' }}
              startIcon={<AddIcon />}
              onClick={handleSafetyForm}
            >
              Safety Form
            </Button>
          </div>
        </div>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="safety dashboard tabs">
                <Tab label="Overview" value="1" />
              </TabList>
            </Box>

            <TabPanel value="1">
              <div className="row">
                {loading ? (
                  // Show skeletons while loading
                  <>
                    <div className="col-lg-6 mb-4"><CardSkeleton /></div>
                    <div className="col-lg-6 mb-4"><CardSkeleton /></div>
                  </>
                ) : (
                  // Show actual type sections
                  cardObj.map((typeData, index) => (
                    <TypeSection key={index} typeData={typeData} />
                  ))
                )}
              </div>
              <div className='row gap-4 mt-4 justify-content-center'>
                <div className={`${Styles.graph} ${Styles.border} col-lg-6`} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  padding: '32px',
                  height: '650px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-6px)',
                    boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <div className={Styles.graphTitle} style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '24px',
                    borderBottom: '2px solid #f0f2f5',
                    paddingBottom: '16px'
                  }}>USC and USA Safety Audits</div>
                  <div style={{ height: '400px' }}>
                    <SafetyGraph 
                      workerData={graphWorkers} 
                      staffData={graphStaff} 
                      xdata={graphXdata}
                      legendLabels={['Workers', 'Staff']} 
                    />
                  </div>
                </div>
                <div className={`${Styles.graph} ${Styles.border} col-lg-5`} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  padding: '32px',
                  height: '650px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-6px)',
                    boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <div className={Styles.graphTitle} style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '24px',
                    borderBottom: '2px solid #f0f2f5',
                    paddingBottom: '16px'
                  }}>Major Areas of Incidents</div>
                  <div style={{ 
                    height: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <Chart
                      options={{
                        ...areaChartConfig.options,
                        chart: {
                          ...areaChartConfig.options.chart,
                          fontFamily: 'inherit',
                          toolbar: {
                            show: true,
                            tools: {
                              download: true,
                              selection: false,
                              zoom: false,
                              zoomin: false,
                              zoomout: false,
                              pan: false,
                              reset: false
                            },
                            autoSelected: 'download',
                            position: 'top',
                            horizontalAlign: 'right',
                            offsetX: 60,
                            offsetY: -10,
                            export: {
                              csv: {
                                filename: 'Major Areas of Incidents',
                                columnDelimiter: ',',
                                headerCategory: 'Area',
                                headerValue: 'Percentage'
                              },
                              svg: {
                                filename: 'Major Areas of Incidents'
                              },
                              png: {
                                filename: 'Major Areas of Incidents'
                              }
                            }
                          }
                        }
                      }}
                      series={areaChartConfig.series}
                      type="pie"
                      height={450}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default SafetyDashboard;







