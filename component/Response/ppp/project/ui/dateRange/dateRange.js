import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js';
import { DateRangePicker } from 'rsuite';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

const DateRange = ({ useForm, trigger, field, sectionName, name }) => {
    const { label, responseType, placeholder, isRequired } = field

    const { register, errors, setValue, errorMsg, reset, watch } = useForm //to get useForm objects and function of RHF.
    const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them.

    const showError = (errors[hookFormLabel] || errorMsg) ? true : false

    const dispatch = useDispatch();
    const stateValue = useSelector((state) => {
        const section = state.form.find(obj => obj.sectionName === sectionName);
        const questionObj = name ? section?.responses.find(obj => obj.question === name)?.answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
        return questionObj?.answer ? questionObj.answer?.map(date => new Date(date)) : [];
    })
    const handleChange = async (event) => {
        const question = label;
        const answer = event.map(date => new Date(date).toISOString());
        setValue(hookFormLabel, answer)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }

    // useEffect(() => {
    //        setValue(hookFormLabel, stateValue);
    //      }, [stateValue])

    return (
        <>
            <InputLabel style={{ width: '100%', position: 'relative', top: '6px', color: 'black', marginLeft: '11px' }} error={showError} required={isRequired}>{label}
            </InputLabel>
            <FormControl sx={{ fontSize: 14, width: '100%', margin: '10px' }} size='small' >
                <div style={{ border: "1px solid rgba(0, 0, 0, 0.3)", borderRadius: '3px', height: '38px', width: '100%' }}>
                    <DateRangePicker
                        id={hookFormLabel}
                        {...register(`${hookFormLabel}`, {
                            value: stateValue,
                            required: isRequired && 'Please select date range',
                        })}
                        // placement='top'
                        defaultValue={stateValue}
                        value={stateValue}
                        format='dd-MM-yyyy'
                        size='md'
                        style={{ width: '100%' }}
                        showOneCalendar
                        onChange={handleChange}
                    />
                </div>
                {errors[hookFormLabel] && <FormHelperText error>{errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}</FormHelperText>}
            </FormControl>
        </>
    )
}

export default DateRange