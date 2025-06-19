import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js';
import { DateRangePicker, DatePicker } from 'rsuite';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { isAfter, isBefore, addHours, startOfToday } from 'date-fns';


const DateAndTimePicker = ({ useForm, trigger, field, sectionName, name }) => {
    const { label, responseType, placeholder, isRequired } = field

    const { register, errors, setValue, errorMsg, reset, watch, setError,
        clearErrors, } = useForm //to get useForm objects and function of RHF.
    const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them.
    const showError = (errors[hookFormLabel] || errorMsg) ? true : false
    const dispatch = useDispatch();

    const endTimeLabel = label === 'End Date';
    const startDateLabel = label === 'Start Date'
    const startDate = useSelector((state) => {
        const section = state.form?.find(obj => obj.sectionName === "Registration");
        const questionObj = section?.responses?.find(obj => obj.question === "Start Date");
        return questionObj?.answer;
    }, shallowEqual)

    const referenceTime = startDate ? new Date(startDate) : new Date();
    const endTime = addHours(referenceTime, 24);

    const stateValue = useSelector((state) => {
        const section = state.form.find(obj => obj.sectionName === sectionName);
        const questionObj = name ? section?.responses.find(obj => obj.question === name)?.answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
        return questionObj?.answer && new Date(questionObj?.answer);
    })

    const handleChange = async (event) => {
        const question = label;
        const answer = event ? new Date(event)?.toISOString() : event;
        setValue(hookFormLabel, event)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }

    return (
        <>
            <InputLabel style={{ width: '100%', position: 'relative', top: '6px', color: 'black', marginLeft: '11px' }} error={showError} required={isRequired}>{label}
            </InputLabel>
            <FormControl sx={{ fontSize: 14, width: '100%', margin: '10px' }} size='small' >
                <div style={{ border: "1px solid rgba(0, 0, 0, 0.3)", borderRadius: '3px', height: '38px', width: '100%' }}>
                    <DatePicker
                        id={hookFormLabel}
                        {...register(`${hookFormLabel}`, {
                            value: stateValue,
                            required: isRequired && 'Please select date range',
                            validate: (value) => {
                                if(!endTimeLabel) return true;
                                if (!value) return true; // required handles null

                                if (value < referenceTime) {
                                    return 'Select Date and Time within 24 Hour Range';
                                }
                                if (value > endTime) {
                                    return 'Select Date and Time within 24 Hour Range';
                                }
                                return true;
                            },
                        })}
                        // placement='top'
                        shouldDisableDate={startDateLabel ? (date => isBefore(date, startOfToday())) : endTimeLabel ? (date => {
                            if (!date || isNaN(new Date(date).getTime())) return false;
                            const gethours = referenceTime?.getHours();
                            const getMinutes = referenceTime?.getMinutes();
                            const dayEnd = new Date(date);
                            dayEnd.setHours(gethours, getMinutes, 59, 999);

                            // If the whole day ends before referenceTime OR starts after endTime, disable it
                            return isBefore(dayEnd, referenceTime) || isAfter(date, endTime);
                        }) : undefined}

                        placement='auto'
                        defaultValue={stateValue}
                        value={stateValue}
                        format="yyyy-MM-dd HH:mm:ss"
                        editable={false}
                        size='md'
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        disabled={false}
                    />
                </div>
                {errors[hookFormLabel] && <FormHelperText error>{errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}</FormHelperText>}
            </FormControl>
        </>
    )
}

export default DateAndTimePicker