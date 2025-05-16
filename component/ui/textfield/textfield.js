import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js';
import TextField from '@mui/material/TextField';
import { convertToNumber } from '../../../helperFunction/stringToNumber.js';
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
    color: 'rgba(0, 0, 0, 0.48)',
    '&::placeholder': {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
});

const Textfield = ({ useForm, trigger, field, sectionName, name }) => {
  const dispatch = useDispatch();
  const { label, responseType, placeholder, isRequired, maxLength, minLength, minValue, maxValue, errorMessage } = field //destructure field.
  const { register, errors, setValue, errorMsg, watch, reset } = useForm //to get useForm objects and function of RHF.
  const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them.
  const dateType = (responseType === 'date' || responseType === 'time');
  const showError = (errors[hookFormLabel] || errorMsg) ? true : false

  const stateValue = useSelector((state) => {
    const section = state.form.find(obj => obj.sectionName === sectionName);
    const questionObj = name ? section?.responses.find(obj => obj.question === name)?.answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
    return questionObj?.answer || '';
  }, shallowEqual)//to get current state from redux

  const handleChange = async (event) => {
    const question = event.target.name;
    const answer = event.target.value;
    setValue(hookFormLabel, answer)
    errors[hookFormLabel] && await trigger(hookFormLabel)
    name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
      dispatch(formAction.updateField({ sectionName, question, answer }));
  }

  useEffect(() => {
    setValue(hookFormLabel, stateValue);
  }, [stateValue])

  return (
    <div style={{ fontSize: '14', width: '100%', margin: '5px' }}>
      <InputLabel style={{ color: 'black', marginLeft: '6px' }} error={showError} required={isRequired}>{label}</InputLabel>
      <CustomTextField
        id={hookFormLabel}
        {...register(`${hookFormLabel}`, {
          value: stateValue,
          required: isRequired && 'This field is required',
          minLength: { value: convertToNumber(minLength), message: `${label} must be at least ${minLength} characters long` },
          maxLength: { value: convertToNumber(maxLength), message: `${label} must be at most ${maxLength} characters long` },
          min: { value: convertToNumber(minValue), message: `minimum value ${minValue}` },
          max: { value: convertToNumber(maxValue), message: `maximum value ${maxValue}` },
        })}
        error={showError}
        helperText={errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}
        // label={dateType ? '' : label}
        placeholder={dateType ? 'hh:mm' : placeholder}
        name={label}
        type={responseType}
        value={stateValue}
        InputLabelProps={{
          required: isRequired,
        }}
        onBlur={() => trigger(hookFormLabel)}
        onChange={handleChange}
        margin="normal"
        size='small'
        fullWidth
        sx={{ margin: '5px' }}
      />

    </div>
  )
}

export default Textfield