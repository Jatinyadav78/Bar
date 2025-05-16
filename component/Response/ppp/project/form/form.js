import React, { useState } from 'react';
import Styles from './form.module.css';
import Box from '@mui/material/Box';
import Fields from '../fields/fields.js';
import Matrix from '../matrix/matrix.js';
import { useSelector } from 'react-redux';
import { useForm, Controller } from "react-hook-form"
import ImpTerms from '../ui/importantTerms/ImpTerms'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const Form = ({
  index,
  sectionName,
  fields,
  sectionLength,
  nextSection,
  prevSection,
  increaseMatrixFieldCount,
  decreaseMatrixFieldCount,
  onSubmit,
  error,
  formErrorMsg,
  imageUrl
}) => {

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
    setError,
    clearErrors,
    reset
  } = useForm()

  const value = useSelector((state) => state.form)
  const [errorMsg, setErrorMsg] = useState('')
  const useHookForm = { Controller, control, watch, register, errors, setValue, errorMsg, reset ,setError,
    clearErrors}
  const submit = (data) => {
    if (index === sectionLength - 2) {
      onSubmit(value);
      reset();
      return;
    }
    nextSection();
  }

  const validateField = async (fieldName) => {
    try {
      await trigger(fieldName); // Trigger validation for the specified field
      setErrorMsg(''); // Clear any previous error message
    } catch (err) {
      setErrorMsg(err.message); // Set error message if validation fails
    }
  };
  return (
    <div id='form' className={`${Styles.section} ${Styles.active} `} >
      <form id='content' className={Styles.content} onSubmit={handleSubmit(submit)} >
        <Box key={`section-${index * sectionLength}`} component="div" className={Styles.formFields}>
          <div id='heading' className={Styles.heading}>
            <h2 id='headingData'>{sectionName}</h2>
          </div>
          {sectionName === "Important Terms" ? < ImpTerms key={index} />
            : fields.map((field, fieldIndex) => {
              const inputLength = field.input.length;
              // if (sectionName !== 'Atmospheric Test') {
              //   return;
              // }
              if (inputLength === 1) {
                return <Fields
                  key={fieldIndex + sectionLength}
                  useForm={useHookForm}
                  trigger={validateField}
                  field={field.input[0]}
                  sectionName={sectionName}
                  imageUrl={imageUrl}
                  fieldIndex={fieldIndex}
                />
              }
              if (field?.matrixFieldCount === 0 && field.matrixAddButton) {
                return (<Button type='button' key={`add-button-${fieldIndex}-${index}`} variant='contained' className={Styles.addButton} onClick={() => increaseMatrixFieldCount(sectionName, field.name, -1, field.input)}>+ Add Personnel</Button>)
              }
              return (<>
                {Array.from({ length: Math.max(field?.matrixFieldCount, 1) }, (_, i) => {
                  if (field.matrixFieldCount > 0) {
                    return (
                      <>
                        <Matrix
                          key={`matrix-${fieldIndex}-${i}-${index}`}
                          matrixIndex={i}
                          useForm={useHookForm}
                          trigger={validateField}
                          increaseMatrixFieldCount={increaseMatrixFieldCount}
                          decreaseMatrixFieldCount={decreaseMatrixFieldCount}
                          field={field}
                          sectionName={sectionName}
                          imageUrl={imageUrl}
                          fieldIndex={fieldIndex}
                        />
                      </>
                    )
                  }
                })}</>)
            })}
        </Box>
        {error && <div className={Styles.error}>{formErrorMsg}</div>}
        {!(sectionName === "Important Terms") && <div className={Styles.warning}>
          <div style={{ color: '#0000009c' }}>WARNING:</div>
          <div className={Styles.warningTxt}>If the information entered in the form is incorrect, a challan will be issued.</div>
        </div>}

        <div className={Styles.buttonContainer}>
          <button type='next' className={Styles.prevButton} disabled={index === 0} onClick={() => { prevSection() }}>Back</  button>
          {!(index === sectionLength - 2) && <button type='submit' className={Styles.nextButton}  >Next</button>}
          {index === sectionLength - 2 && <button type='submit' className={Styles.nextButton} > Submit</button>}
        </div>
      </form>
    </div>
  )
}

export default Form
