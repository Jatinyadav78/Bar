import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Grid, Card, CardContent, Typography, Button, Stack, Popover } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getLocalStorage } from '../../helperFunction/localStorage';
import { API_URL } from '../../utils';
import { useRouter } from 'next/navigation';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const FirDashboard = () => {
  const router = useRouter();
  // Add state for filter and data
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    // Get current month's date range
    const now = dayjs();
    const startOfMonth = now.startOf('month').format('YYYY-MM-DD');
    const currentDate = now.format('YYYY-MM-DD');
    
    // Set the date states
    setStartDate(dayjs(startOfMonth));
    setEndDate(now);
    
    // Fetch data with date range
    fetchFirData(startOfMonth, currentDate);
  }, []);

  const fetchFirData = async (start = null, end = null) => {
    try {
      const token = getLocalStorage('token')?.access?.token;
      const orgId = getLocalStorage('user')?.organizationId;
      let url = `${API_URL}/v1/safety/incidence?orgId=${orgId}`;
      
      if (start) {
        url += `&startDate=${start}`;
      }
      if (end) {
        url += `&endDate=${end}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FIR data:', error);
      setLoading(false);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf('day');
      const end = dayjs(endDate).endOf('day');
      
      // Format dates for API
      const formattedStartDate = start.format('YYYY-MM-DD');
      const formattedEndDate = end.format('YYYY-MM-DD');
      
      // Fetch filtered data from API
      fetchFirData(formattedStartDate, formattedEndDate);
    }
    handleFilterClose();
  };

  // Add handleFirForm function
  const handleFirForm = () => {
    const orgId = getLocalStorage('user')?.organizationId;
    const firFormId = '68246de56f19ea240cf88b12';
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    const url = `${window.location.origin}/home?id=${firFormId}&orgId=${orgId}&till=${expiryDate.toISOString()}`;
    window.open(url, '_blank');
  };

  // Process data for cause distribution
  const causeData = filteredData.reduce((acc, item) => {
    const cause = item.cause || "Unknown";
    acc[cause] = (acc[cause] || 0) + 1;
    return acc;
  }, {});

  // Process data for treatment types
  const treatmentData = filteredData.reduce((acc, item) => {
    const treatment = item.treatment || "Unknown";
    acc[treatment] = (acc[treatment] || 0) + 1;
    return acc;
  }, {});

  // Process data for PPE Status
  const ppeData = filteredData.reduce((acc, item) => {
    const ppe = item.ppeStatus || "Unknown";
    acc[ppe] = (acc[ppe] || 0) + 1;
    return acc;
  }, {});

  // Process data for experience levels
  const experienceData = filteredData.reduce((acc, item) => {
    const exp = item.experience || "Unknown";
    acc[exp] = (acc[exp] || 0) + 1;
    return acc;
  }, {});

  // Process data for IP Status
  const ipStatusData = filteredData.reduce((acc, item) => {
    const status = item.ipStatus || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Calculate summary metrics
  const summaryMetrics = {
    totalIncidents: filteredData.length,
    majorIncidents: filteredData.filter(item => item.incidenceCategory === 'Major B').length,
  };

  const chartConfigs = {
    cause: {
      options: {
        chart: { 
          type: 'pie',
          fontFamily: 'inherit'
        },
        title: { 
          text: 'Incident Causes',
          style: {
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'inherit'
          }
        },
        labels: Object.keys(causeData),
        colors: ['#4361ee', '#3f8cff', '#6c8cff', '#95a8ff', '#b8c3ff'],
        legend: {
          position: 'bottom',
          fontSize: '14px',
          fontFamily: 'inherit'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%'
            }
          }
        }
      },
      series: Object.values(causeData)
    },
    treatment: {
      options: {
        chart: { 
          type: 'donut',
          fontFamily: 'inherit'
        },
        title: { 
          text: 'Treatment Types',
          style: {
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'inherit'
          }
        },
        labels: Object.keys(treatmentData),
        colors: ['#FF9800', '#FFB74D', '#FFCC80', '#FFE0B2'],
        legend: {
          position: 'bottom',
          fontSize: '14px',
          fontFamily: 'inherit'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '60%'
            }
          }
        }
      },
      series: Object.values(treatmentData)
    },
    ppe: {
      options: {
        chart: { type: 'pie' },
        title: { text: 'PPE Status Distribution' },
        labels: Object.keys(ppeData),
        colors: ['#4CAF50', '#f44336'],
        legend: {
          position: 'bottom'
        }
      },
      series: Object.values(ppeData)
    },
    experience: {
      options: {
        chart: { 
          type: 'bar',
          toolbar: {
            show: false
          },
          fontFamily: 'inherit'
        },
        title: { 
          text: 'Experience Level Distribution',
          style: {
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'inherit'
          }
        },
        xaxis: { 
          categories: Object.keys(experienceData),
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'inherit'
            }
          }
        },
        colors: ['#48cae4'],
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: '60%',
            horizontal: false,
            distributed: true
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: '#f1f1f1'
        }
      },
      series: [{ name: 'Incidents', data: Object.values(experienceData) }]
    },
    ipStatus: {
      options: {
        chart: { 
          type: 'donut',
          fontFamily: 'inherit'
        },
        title: { 
          text: 'IP Status Distribution',
          style: {
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'inherit'
          }
        },
        labels: Object.keys(ipStatusData),
        colors: ['#4CAF50', '#81C784', '#A5D6A7'],
        legend: {
          position: 'bottom',
          fontSize: '14px',
          fontFamily: 'inherit'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '60%'
            }
          }
        }
      },
      series: Object.values(ipStatusData)
    }
  };

  const handleViewAllIncidents = () => {
    // Store the current data and filters
    localStorage.setItem('firIncidentsData', JSON.stringify(filteredData));
    localStorage.setItem('fromFirDashboard', 'true');
    
    // Store date filters if they exist
    if (startDate && endDate) {
      localStorage.setItem('firDateFilters', JSON.stringify({
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD')
      }));
    }
    
    // Navigate to the status page
    router.push('/safety-conditions/all');
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#f8fafc' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
          FIR Dashboard Analytics
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ backgroundColor: '#0073FF' }}
            disabled={loading}
          >
            Filter
          </Button>
          <Popover
            id={Boolean(anchorEl) ? 'filter-popover' : undefined}
            open={Boolean(anchorEl)}
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
                      setFilteredData(data);
                      // Clear any stored filters
                      localStorage.removeItem('firDateFilters');
                      // Fetch fresh data without date filters
                      fetchFirData();
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
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleFirForm}
            sx={{ backgroundColor: '#0073FF' }}
          >
            FIR Form
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Typography variant="h6" sx={{ color: '#64748b' }}>Loading dashboard data...</Typography>
        </Box>
      ) : filteredData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Typography variant="h6" sx={{ color: '#64748b' }}>No FIR data available for the selected period</Typography>
        </Box>
      ) : (
        <>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}
          onClick={handleViewAllIncidents}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>Total Incidents</Typography>
              <Typography variant="h3" sx={{ 
                color: '#4361ee', 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4361ee, #3f8cff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>{summaryMetrics.totalIncidents}</Typography>
                </Box>
                <OpenInNewIcon sx={{ 
                  color: '#4361ee',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    opacity: 1
                  }
                }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                Click to view all incidents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>Major Incidents</Typography>
              <Typography variant="h3" sx={{ 
                color: '#FF9800',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FF9800, #FFB74D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>{summaryMetrics.majorIncidents}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                Category B incidents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Cause Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Chart
                options={chartConfigs.cause.options}
                series={chartConfigs.cause.series}
                type="pie"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Treatment Types */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Chart
                options={chartConfigs.treatment.options}
                series={chartConfigs.treatment.series}
                type="donut"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* PPE Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Chart
                options={chartConfigs.ppe.options}
                series={chartConfigs.ppe.series}
                type="pie"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Experience Level */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Chart
                options={chartConfigs.experience.options}
                series={chartConfigs.experience.series}
                type="bar"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* IP Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-6px)',
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Chart
                options={chartConfigs.ipStatus.options}
                series={chartConfigs.ipStatus.series}
                type="donut"
                height={350}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        </>
      )}
    </Box>
  );
};

export default FirDashboard; 