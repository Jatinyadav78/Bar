import React, { useState, useRef, useEffect } from 'react';
import './filterModal.css'
import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { Button } from '@mui/material';
import { DateRangePicker } from 'rsuite';

const Modal = ({ handleFilter, handleRemoveFilter }) => {
  // Ref for detecting clicks outside modal
  const divRef = useRef(null);
  
  // State for modal visibility and date selection
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectDate, setSelectDate] = useState([]);

  // Handle applying selected filters
  const handleApply = () => {
    // Only apply filter if dates are selected
    if (selectDate && selectDate.length > 0) {
      const filterData = {
        dateFilter: selectDate,
      };
      handleFilter(filterData);
    }
    setIsFilterModalOpen(false);
  };

  // Handle removing all filters
  const handleRemove = () => {
    handleRemoveFilter();
    setSelectDate([]); // Clear selected dates
    setIsFilterModalOpen(false);
  };

  // Close modal when clicking outside
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIsFilterModalOpen(false);
    }
  };

  // Add/remove click outside listener
  useEffect(() => {
    if (isFilterModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterModalOpen]);

  return (
    <>
      {/* Filter Button */}
      <Button
        style={{ borderColor: "grey", color: 'grey', width: '100%', height: '26px' }}
        variant='outlined'
        size='small'
        onClick={() => setIsFilterModalOpen(prev => !prev)}
        startIcon={<FilterListSharpIcon />}
        endIcon={<ArrowDropDownSharpIcon />}
      >
        filter
      </Button>

      {/* Modal Overlay */}
      {isFilterModalOpen && (
        <div className='modal-overlay' onClick={handleClickOutside}></div>
      )}

      {/* Filter Modal */}
      <div className={`filterModal check ${isFilterModalOpen ? 'open' : ''}`} ref={divRef}>
        <label>
          Select Date
          <DateRangePicker 
            className='check' 
            placement='bottomEnd' 
            format='dd-MM-yyyy' 
            size='md' 
            style={{ width: '100%' }} 
            value={selectDate}
            showOneCalendar
            onChange={(dates) => setSelectDate(dates)} 
          />
        </label>

        {/* Action Buttons */}
        <div className="buttonCont">
          <Button 
            variant='outlined' 
            size='small' 
            onClick={handleRemove}
          >
            Remove
          </Button>
          <Button 
            variant='contained' 
            size='small' 
            onClick={handleApply}
            disabled={!selectDate || selectDate.length === 0}
          >
            Apply
          </Button>
        </div>
      </div>
    </>
  );
};

export default Modal;