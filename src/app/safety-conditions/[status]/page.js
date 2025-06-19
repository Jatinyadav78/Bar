"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Typography, Button, Modal, Box, Grid, Popover, Stack, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getLocalStorage } from '../../../../helperFunction/localStorage';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterListIcon from '@mui/icons-material/FilterList';
import ImageIcon from '@mui/icons-material/Image';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import dayjs from 'dayjs';
import { API_URL, HOST } from '../../../../utils';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const SafetyConditionPage = ({ params }) => {
  const router = useRouter();
  let url = API_URL;
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFromFirDashboard, setIsFromFirDashboard] = useState(false);
  const [incidenceCategory, setIncidenceCategory] = useState('');
  const [jobStatus, setJobStatus] = useState('');

  useEffect(() => {
    // Check if coming from FIR Dashboard
    const fromFirDashboard = localStorage.getItem('fromFirDashboard');
    setIsFromFirDashboard(fromFirDashboard === 'true');

    if (fromFirDashboard === 'true') {
      // Load FIR data
      const firData = localStorage.getItem('firIncidentsData');
      if (firData) {
        setConditions(JSON.parse(firData));
      }

      // Load FIR date filters
      const firDateFilters = localStorage.getItem('firDateFilters');
      if (firDateFilters) {
        const { startDate: start, endDate: end } = JSON.parse(firDateFilters);
        if (start) setStartDate(dayjs(start));
        if (end) setEndDate(dayjs(end));
      }
    } else {
      // Original safety conditions logic
    const storedConditions = localStorage.getItem('filteredSafetyConditions');
    const storedDateFilters = localStorage.getItem('safetyDateFilters');
      const formType = localStorage.getItem('formType');
      const selectedStatus = localStorage.getItem('selectedStatus');
    
    if (storedConditions) {
      setConditions(JSON.parse(storedConditions));
    }
    
      if (storedDateFilters && formType) {
      const { startDate: start, endDate: end } = JSON.parse(storedDateFilters);
      if (start) setStartDate(dayjs(start));
      if (end) setEndDate(dayjs(end));
        fetchFilteredData(start, end, formType, selectedStatus);
      } else {
        fetchFilteredData(null, null, formType, selectedStatus);
      }
    }

    // Cleanup function
    return () => {
      if (fromFirDashboard === 'true') {
        localStorage.removeItem('fromFirDashboard');
        localStorage.removeItem('firIncidentsData');
        localStorage.removeItem('firDateFilters');
      } else {
        localStorage.removeItem('formType');
        localStorage.removeItem('selectedStatus');
      }
    };
  }, []);

  const fetchFilteredData = async (start = null, end = null, formType = null, status = null) => {
    try {
      const token = getLocalStorage('token')?.access?.token;
      const orgId = getLocalStorage('user')?.organizationId?.[0];
      
      // Choose the correct endpoint based on source
      const endpoint = isFromFirDashboard ? 'incidence' : 'safety-condition';
      let url = `${API_URL}/v1/safety/${endpoint}?orgId=${orgId}`;
      
      // Add formType parameter if available
      if (formType) {
        url += `&formType=${formType}`;
      }

      // Add status parameter if available
      if (status) {
        url += `&status=${status}`;
      }
      
      if (start) {
        url += `&startDate=${start}`;
      }
      if (end) {
        url += `&endDate=${end}`;
      }

      // Add FIR specific filters if coming from FIR dashboard
      if (isFromFirDashboard) {
        if (incidenceCategory) {
          url += `&incidenceCategory=${incidenceCategory}`;
        }
        if (jobStatus) {
          url += `&jobStatus=${jobStatus}`;
        }
      }
     
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConditions(data);
        
        // Store the filtered data in localStorage if coming from FIR dashboard
        if (isFromFirDashboard) {
          localStorage.setItem('firIncidentsData', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };
   
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    let formattedStartDate = null;
    let formattedEndDate = null;
    
    if (startDate && endDate) {
      formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
      formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    }
    
    // Get the current formType and status
    const formType = localStorage.getItem('formType');
    const selectedStatus = localStorage.getItem('selectedStatus');
    
    // Store the filters if coming from FIR dashboard
    if (isFromFirDashboard) {
      localStorage.setItem('firDateFilters', JSON.stringify({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        incidenceCategory,
        jobStatus
      }));
    } else {
      localStorage.setItem('safetyDateFilters', JSON.stringify({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }));
    }
    
    fetchFilteredData(formattedStartDate, formattedEndDate, formType, selectedStatus);
    handleFilterClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  const handleStatusChange = async (conditionId) => {
    try {
      const token = getLocalStorage('token')?.access?.token;
      const conditionToUpdate = conditions.find(c => c._id === conditionId);
      
      if (!conditionToUpdate) {
        console.error('Condition not found');
        return;
      }

      // Create updated condition object
      const updatedCondition = {
        ...conditionToUpdate,
        status: 'closed'
      };

      const response = await fetch(`${API_URL}/v1/safety/safety-condition/${conditionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCondition)
      });

      if (response.ok) {
        // Update local state
        setConditions(prevConditions => 
          prevConditions.map(condition => 
            condition._id === conditionId 
              ? updatedCondition
              : condition
          )
        );
        setIsModalOpen(false);
        // Navigate back to safety dashboard
        router.push('/safety-dashboard');
      } else {
        console.error('Failed to update status:', await response.text());
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCardClick = (condition) => {
    setSelectedCondition(condition);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCondition(null);
  };

  const getImagesFromFirData = (condition) => {
    if (!condition?.responseData) return [];
    
    let images = [];
    condition.responseData.forEach(section => {
      section.responses.forEach(response => {
        if (response.responseType === 'profileImage' && response.answer && Array.isArray(response.answer)) {
          images = [...images, ...response.answer];
        }
      });
    });
    return images;
  };

  const getImagesFromSafetyData = (condition) => {
    if (!condition?.responseData) return [];
    
    let images = [];
    condition.responseData.forEach(section => {
      section.responses.forEach(response => {
        if (response.responseType === 'profileImage' && response.answer && Array.isArray(response.answer)) {
          images = [...images, ...response.answer];
        }
      });
    });
    return images;
  };

  const handleViewImages = (condition, e) => {
    e.stopPropagation();
    let images = [];
    
    if (isFromFirDashboard) {
      images = getImagesFromFirData(condition);
    } else {
      // For safety conditions, extract images from responseData
      images = getImagesFromSafetyData(condition);
    }
    
    if (Array.isArray(images) && images.length > 0) {
      setCurrentImages(images);
      setCurrentImageIndex(0);
      setIsViewModalOpen(true);
    } else {
      // Show alert when no images are available
      alert('No images available for this form submission.');
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  };

  const renderConditionCard = (condition) => {
    const registrationData = condition.responseData.find(section => section.sectionName === "Registration");
    const unsafeActData = condition.responseData.find(section => section.sectionName === "Unsafe Act and Unsafe Condition");
    const incidentData = condition.responseData.find(section => section.sectionName === "Incident Details");

    const getResponseValue = (section, questionName) => 
      section?.responses.find(response => response.question === questionName)?.answer || 'N/A';

    // Get the appropriate name based on form type
    const getName = () => {
      if (isFromFirDashboard) {
        // For incident forms, look for "Reported By" in any section
        for (const section of condition.responseData || []) {
          const reportedBy = section.responses.find(r => r.question === "Reported By:");
          if (reportedBy) {
            return reportedBy.answer;
          }
        }
        return 'N/A';
      } else {
        // For safety conditions, look for "Auditee Name"
        return getResponseValue(unsafeActData, "Auditee Name");
      }
    };

    // Get the date from form data
    const getFormDate = () => {
      return condition?.date?.split('T')[0];
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'open':
          return {
            light: '#e0f2fe',
            main: '#0284c7',
            border: '#bae6fd'
          };
        case 'closed':
          return {
            light: '#dcfce7',
            main: '#059669',
            border: '#86efac'
          };
        default:
          return {
            light: '#fef9c3',
            main: '#d97706',
            border: '#fde047'
          };
      }
    };

    const statusColors = getStatusColor(condition.status);
    const images = isFromFirDashboard ? getImagesFromFirData(condition) : getImagesFromSafetyData(condition);

    return (
      <Grid item xs={12} md={6} lg={4} key={condition._id}>
        <Card 
          sx={{ 
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              cursor: 'pointer'
            },
            position: 'relative',
            overflow: 'visible'
          }}
          onClick={() => handleCardClick(condition)}
        >
          <CardContent sx={{ p: 3 }}>
            {!isFromFirDashboard && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: statusColors.light,
                  border: `1px solid ${statusColors.border}`,
                  borderRadius: '9999px',
                  px: 2,
                  py: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color: statusColors.main,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}
                >
                  {condition.status}
                </Typography>
              </Box>
            )}

            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '1.25rem',
                mb: 3,
                pr: isFromFirDashboard ? 2 : 8
              }}
            >
              {condition.formName}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#64748b',
                      flexShrink: 0
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {isFromFirDashboard ? 'Reported By' : 'Name'}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    color: '#334155',
                    fontWeight: 600,
                    pl: 2,
                    fontSize: '0.875rem'
                  }}
                >
                  {getName()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#64748b',
                      flexShrink: 0
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {isFromFirDashboard ? 'Date of Incident' : 'Date'}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    color: '#334155',
                    fontWeight: 600,
                    pl: 2,
                    fontSize: '0.875rem'
                  }}
                >
                  {getFormDate()}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
              {!isFromFirDashboard && (condition.status === 'open' || condition.status === 'pending') && (
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCondition(condition);
                    setIsModalOpen(true);
                  }}
                  sx={{ 
                    py: 1,
                    backgroundColor: '#4338ca',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#3730a3',
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    flex: '1 1 100%'
                  }}
                >
                  Mark as Closed
                </Button>
              )}
              <Button
                variant="outlined"
                size="medium"
                startIcon={<ImageIcon />}
                onClick={(e) => handleViewImages(condition, e)}
                disabled={images.length === 0}
                sx={{
                  borderColor: '#0073FF',
                  color: '#0073FF',
                  flex: '1 1 calc(50% - 4px)',
                  '&:hover': {
                    borderColor: '#0059B2',
                    backgroundColor: 'rgba(0, 115, 255, 0.04)'
                  }
                }}
              >
                View Images ({images.length})
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // Add a function to clear filters
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setIncidenceCategory('');
    setJobStatus('');
    
    // Get the current formType and status
    const formType = localStorage.getItem('formType');
    const selectedStatus = localStorage.getItem('selectedStatus');
    
    // Clear stored filters
    if (isFromFirDashboard) {
      localStorage.removeItem('firDateFilters');
    } else {
      localStorage.removeItem('safetyDateFilters');
    }
    
    fetchFilteredData(null, null, formType, selectedStatus);
    handleFilterClose();
  };

  // Update the details modal content based on the source
  const renderModalContent = () => {
    if (!selectedCondition) return null;

      // Render FIR form details
      return selectedCondition.responseData.map((section, index) => (
        <Box 
          key={index}
          sx={{ 
            mb: 2.5,
            p: 3,
            backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#cbd5e1',
              transform: 'translateX(4px)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
            }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#1e293b',
              fontWeight: 600,
              mb: 2,
              borderBottom: '2px solid #f1f5f9',
              pb: 1
            }}
          >
            {section.sectionName}
          </Typography>
          {section.responses.map((response, rIndex) => (
            <Box key={rIndex} sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#475569',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#4338ca',
                    flexShrink: 0
                  }} 
                />
                {response.question}
              </Typography>
              <Typography 
                sx={{ 
                  color: '#334155',
                  fontWeight: 500,
                  pl: 3
                }}
              >
                {response.answer || 'N/A'}
              </Typography>
            </Box>
          ))}
        </Box>
      ));
  };

  const handleBackToDashboard = () => {
    // Clear localStorage items
    localStorage.removeItem('fromFirDashboard');
    localStorage.removeItem('firIncidentsData');
    localStorage.removeItem('firDateFilters');
    localStorage.removeItem('formType');
    
    // Navigate to the appropriate dashboard
    if (isFromFirDashboard) {
      router.push('/fir-dashboard');
    } else {
      router.push('/safety-dashboard');
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <Button 
          variant="outlined" 
          onClick={handleBackToDashboard}
          sx={{
            borderColor: '#e0e7ff',
            color: '#4338ca',
            '&:hover': {
              borderColor: '#4338ca',
              backgroundColor: '#e0e7ff',
            }
          }}
        >
          Back to {isFromFirDashboard ? 'FIR' : 'Safety'} Dashboard
        </Button>
        <Typography 
          variant="h4" 
          sx={{ 
            textTransform: 'capitalize',
            color: '#1e293b',
            fontWeight: 600,
            flex: 1
          }}
        >
          {isFromFirDashboard ? 'Incident Reports' : `${params.status} Safety Conditions`}
        </Typography>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{
            backgroundColor: '#4338ca',
            '&:hover': {
              backgroundColor: '#3730a3',
            }
          }}
        >
          Filter
        </Button>
      </div>

      <Grid container spacing={3}>
        {conditions.map(renderConditionCard)}
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Box sx={{
          ...modalStyle,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          padding: '24px'
        }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>
            Confirm Status Change
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: '#475569' }}>
            Are you sure you want to mark this condition as closed?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              onClick={() => setIsModalOpen(false)}
              sx={{ 
                color: '#475569',
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleStatusChange(selectedCondition?._id)}
              sx={{
                backgroundColor: '#4338ca',
                '&:hover': {
                  backgroundColor: '#3730a3',
                }
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 700,
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {selectedCondition && (
            <>
              <Box sx={{ 
                p: 3,
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                gap: 2
              }}>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ 
                    color: '#1e293b', 
                    fontWeight: 700,
                    mb: 0.5
                  }}>
                    {isFromFirDashboard ? 'Incident Details' : 'Safety Condition Details'}
                  </Typography>
                  <Typography variant="subtitle1" sx={{
                    color: '#64748b',
                    fontSize: '0.875rem'
                  }}>
                    {selectedCondition.formName}
                  </Typography>
                </Box>
                <Button 
                  onClick={handleCloseDetailsModal}
                  sx={{ 
                    minWidth: '36px',
                    height: '36px',
                    p: 0,
                    borderRadius: '12px',
                    color: '#64748b',
                    '&:hover': { 
                      backgroundColor: '#f1f5f9',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <CloseIcon />
                </Button>
              </Box>

              <Box sx={{
                p: 3,
                overflowY: 'auto',
                flex: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                  background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '24px',
                  border: '2px solid #ffffff'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                }
              }}>
                {renderModalContent()}
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Image View Modal */}
      <Modal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        aria-labelledby="image-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          outline: 'none',
        }}>
          <Box sx={{ 
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="h6">
                {currentImages.length > 0 
                  ? `Image ${currentImageIndex + 1} of ${currentImages.length}` 
                  : 'No Images Available'
                }
              </Typography>
              <IconButton
                onClick={handleCloseViewModal}
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ 
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {currentImages.length > 0 ? (
                <>
                  <img
                    src={currentImages[currentImageIndex]}
                    alt={`Safety condition image ${currentImageIndex + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain'
                    }}
                  />
                  {currentImages.length > 1 && (
                    <>
                      <IconButton
                        onClick={handlePrevImage}
                        sx={{
                          position: 'absolute',
                          left: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                          }
                        }}
                      >
                        <ArrowBackIosNewIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleNextImage}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                          }
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </>
                  )}
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2,
                  color: '#64748b'
                }}>
                  <AddPhotoAlternateIcon sx={{ fontSize: 64, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ color: '#64748b' }}>
                    No Images Available
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
                    This form submission does not contain any uploaded images.
                  </Typography>
                </Box>
              )}
            </Box>

            {currentImages.length > 1 && (
              <Box sx={{ 
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                py: 1,
                px: 2,
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#555'
                  }
                }
              }}>
                {currentImages.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: '80px',
                      height: '80px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '2px solid #0073FF' : '2px solid transparent',
                      borderRadius: 1,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Modal>

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
        PaperProps={{
          sx: {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            borderRadius: '12px'
          }
        }}
      >
        <Box sx={{ p: 3, width: '300px' }}>
          <Stack spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ 
                  textField: { 
                    size: 'small', 
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#4338ca',
                        }
                      }
                    }
                  } 
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ 
                  textField: { 
                    size: 'small', 
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#4338ca',
                        }
                      }
                    }
                  } 
                }}
              />
            </LocalizationProvider>
            {isFromFirDashboard && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Incidence Category</InputLabel>
                  <Select
                    value={incidenceCategory}
                    onChange={(e) => setIncidenceCategory(e.target.value)}
                    label="Incidence Category"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Minor">Minor</MenuItem>
                    <MenuItem value="First Aid">First Aid</MenuItem>
                    <MenuItem value="Major A">Major A</MenuItem>
                    <MenuItem value="Major B">Major B</MenuItem>
                    <MenuItem value="Major Fire">Major Fire</MenuItem>
                    <MenuItem value="Fatal">Fatal</MenuItem>
                    <MenuItem value="Minor Fire">Minor Fire</MenuItem>
                    {/* <MenuItem value="Fatal Injury"Fatal </MenuItem> */}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Job Status</InputLabel>
                  <Select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value)}
                    label="Job Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="On Roll">On Roll</MenuItem>
                    <MenuItem value="Contractual">Contractual</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                fullWidth
                sx={{
                  borderColor: '#4338ca',
                  color: '#4338ca',
                  '&:hover': {
                    borderColor: '#3730a3',
                    backgroundColor: 'rgba(67, 56, 202, 0.04)',
                  }
                }}
              >
                Clear Filters
              </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              fullWidth
              sx={{
                backgroundColor: '#4338ca',
                '&:hover': {
                  backgroundColor: '#3730a3',
                }
              }}
            >
              Apply Filter
            </Button>
            </Box>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
};

export default SafetyConditionPage; 