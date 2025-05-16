import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import "./filterModal.css"
// import { borderRadius, minWidth } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "50%",
  minWidth:'300px',
  bgcolor: 'background.paper',
  borderRadius:'15px',
  boxShadow: 24,
  p: 4,
  paddingTop: '13px',
};

export default function TransitionsModal({ isOpen, onClose, children, heading, boxStyle }) {
  
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal
      className={!isOpen ? 'MuiModal-root hidden' : 'MuiModal-root'}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen} className='check'>
        <Box sx={boxStyle? boxStyle: style}>
          <div className="d-flex justify-content-between p-2 ">
            <div className="modal-heading">
              <strong>
                <h2 style={{ textTransform: "capitalize" }}>{heading}</h2>
              </strong>
            </div>
            <div className="modal-close-btn">
              <IconButton onClick={handleClose}>
                <CancelIcon />
              </IconButton>
            </div>
          </div>
          {children}
        </Box>
      </Fade>
    </Modal >
  );
}