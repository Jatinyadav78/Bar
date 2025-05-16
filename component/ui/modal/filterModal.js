import React, { useState, useRef, useEffect } from 'react';
import './filterModal.css'
import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { Button } from '@mui/material';
import { DateRangePicker } from 'rsuite';


const Modal = ({ handleFilter, handleRemoveFilter }) => {
  const divRef = useRef(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectDate, setSelectDate] = useState([])
  const handleApply = () => {
    const obj = {
      dateFilter: selectDate,
    }
    handleFilter(obj)
    setIsFilterModalOpen(false)
  }
  const handleRemove = () => {
    handleRemoveFilter()
    setSelectDate([])
    setIsFilterModalOpen(false)
  }

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      // Close the div if clicked outside
      setIsFilterModalOpen(false)
    }
  };


  return (
    <>
      <Button
        style={{ borderColor: "grey", color: 'grey', width: '100%', height: '26px' }}
        variant='outlined'
        size='small'
        onClick={() => setIsFilterModalOpen(prev => !prev)}
        startIcon={<FilterListSharpIcon />}
        endIcon={<ArrowDropDownSharpIcon />}
      >filter</Button>
      {isFilterModalOpen && <div className='modal-overlay' onClick={handleClickOutside}></div>}
      <div className={`filterModal check ${isFilterModalOpen ? 'open' : ''}`} ref={divRef}>
        <label>Select Date
          <DateRangePicker className='check' placement='bottomEnd' format='dd-MM-yyyy' size='md' style={{ width: '100%' }} value={selectDate}
            showOneCalendar onChange={(event) => setSelectDate(event)} />
        </label>
        <div className="buttonCont" >
          <Button variant='outlined' size='small' onClick={handleRemove} >Remove</Button>
          <Button variant='contained' size='small' onClick={handleApply} >Apply</Button>
        </div>

      </div>
    </>
  )
}

export default Modal;