import React, { useState } from 'react';
import Styles from './response.module.css'; // Import your CSS file
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponseDetails from './responseDetails/responseDetails.js'
import Status from '../status/status';
import {separateNumberFromString} from '../../helperFunction/separateNumberFromString.js'

const response = ({ sectionName, response =['hi'], permitNumber, isAccordianExt}) => {
  const [extend, setExtend] = useState(false);

    const inspection = response?.some(item => (item?.responseType === 'inspection')) || sectionName === 'status';

  return (
    <div className={Styles.matrix}>
      <Accordion className={Styles.customAccordian} onClick={()=> setExtend(prev => !prev)} expanded={isAccordianExt ? isAccordianExt : extend}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ textTransform: "capitalize", color: "#0073FF", fontWeight: '600' }}>{sectionName}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <div className={(inspection) ? '' : Styles.formFields}>
            {/* {sectionName === 'imageCapture' && <Camera />} */}
            {sectionName === 'status'?
            response.map(({ designation, remark, status, email, statusChangeAt, isMandatory },index) => {
              // eslint-disable-next-line react/jsx-key
              return <Status key={index} title={designation} details={remark} status={status} email={email} statusChangeAt={statusChangeAt} isMandatory={isMandatory}/>
            }):response.map((field, index) => {
              if (field.responseType === 'Matrix') {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <div key={index} className={Styles.matrix}>
                    <div className={Styles.question}>{`${separateNumberFromString(field.question)?.number + 1}. ${separateNumberFromString(field.question)?.nonNumber}`}</div>
                    <div className={`${(inspection) ? '' :Styles.formFields} ${Styles.matrixAns}`} >
                      {field.answer.map((ans, index) => {
                        return <ResponseDetails key={index} field={ans} index={index} />
                      })}
                    </div>
                  </div>
                )
              }
              return <ResponseDetails key={index} field={field} index={index} />
            })}
            
          </div>
        </AccordionDetails>
      </Accordion>
    </div>



    
  );
};

export default response;

//const myAccordian = ()=>{

// const [focused, setFocused] = useState(false);
  // const [showInputs, setShowInputs] = useState(false);

  // const handleFocus = () => {
  //   setFocused(true);
  //   setShowInputs(false); // Hide inputs on focus
  // };

  // const handleClick = () => {
  //   setFocused(!focused);
  //   setShowInputs(!showInputs); // Toggle inputs visibility
  // };

  // const handleBlur = () => {
  //   setFocused(false);
  //   setShowInputs(false)
  // };
  
  
  //   const radio = (question, answer)=>{
    //     return 
    //   }

 //return(
  // <div className={`${Styles.inputContainer} ${focused ? Styles.focused : ''}`}>
    //   <div className={Styles.title}>{sectionName}</div>
    //   <div
    //     className={`${Styles.contentBox} ${showInputs ? Styles.expanded : ''}`}
    //     onClick={handleClick}
    //     // onFocus={handleFocus}
    //     // onBlur={handleBlur}
    //     tabIndex={0} // Add tabIndex for focus management
    //   >
    //    {showInputs && (
    //       <div className={Styles.fieldsRes}>
    //         {response.map((field)=>{
    //             return(<div>
    //                     <div className={Styles.question}>{field.question}</div>
    //                     <div className={Styles.answer}>{field.answer}</div>
    //                 </div>)
    //         })}
    //       </div>
    //     )}
    //   </div>
    // </div>
   // )
//}