import React, { useEffect } from 'react';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js'
import FormHelperText from '@mui/material/FormHelperText';

const CheckboxField = ({ useForm, trigger, field, sectionName, name }) => {
    const { label, responseType, placeholder, isRequired, errorMessage, options = [] } = field;
    const { register, errors, setValue, errorMsg, reset, watch } = useForm //to get useForm objects and function of RHF.
    const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them
    const showError = (errors[hookFormLabel] || errorMsg) ? true : false

    const dispatch = useDispatch();
    const stateValue = useSelector((state) => {
        const section = state.form.find(obj => obj.sectionName === sectionName);
        const questionObj = name ? section?.responses.find(obj => obj.question === name).answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
        return questionObj?.answer || false;
    }, shallowEqual)
    const handleChange = async (event) => {
        const question = event.target.name;
        const answer = event.target.checked;
        setValue(hookFormLabel, answer)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }

   useEffect(() => {
       setValue(hookFormLabel, stateValue);
     }, [stateValue])

     return (
        <FormControlLabel
            // sx={{ fontSize: 14, width: '100%', margin: '5px' }}
            {...register(`${hookFormLabel}`, {
                value: stateValue,
                required: isRequired && 'This field is required',
            })}
            error={showError}
            id='checkbox'
            labelPlacement="start"
            control={<Checkbox
                size='small'
                error={showError}
                onBlur={() => trigger(hookFormLabel)} F
                checked={stateValue}
                onChange={handleChange}
                helperText={errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}
            />}
            label={label}
            required={isRequired}
            helperText={errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}
            name={label}
        />

    )
}

export default CheckboxField