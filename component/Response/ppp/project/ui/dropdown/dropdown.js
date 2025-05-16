import React, { useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import { formAction } from '../../../store/formSlice.js'
import Box from '@mui/material/Box';

const DropDown = ({ useForm, trigger, field, sectionName, name }) => {
    const { label, responseType, placeholder, isRequired, errorMessage, options = [] } = field;
    const multiSelector = responseType === 'multiSelect';
    const { register, errors, setValue, errorMsg } = useForm //to get useForm objects and function of RHF.
    const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them.

    const dispatch = useDispatch();
    const stateValue = useSelector((state) => {
        const section = state.form.find(obj => obj.sectionName === sectionName);
        const questionObj = name ? section?.responses.find(obj => obj.question === name).answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
        return questionObj?.answer || [];
    })

    const handleChange = async (event) => {
        const question = event.target.name;
        const answer = event.target.value;
        setValue(hookFormLabel, answer)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }
    const handleMultiSelectorChange = async (event) => {
        const question = event.target.name;
        const answer = event.target.value;
        setValue(hookFormLabel, answer)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }

    const renderValue = (selected) => {
        if (multiSelector) {
            return selected.join(', ');
        }
        return selected;
    }
    return (
        <FormControl sx={{ fontSize: 14, width: '100%', margin: '10px' }} size='small' >
            <InputLabel id="demo-select-small-label" error={errors[hookFormLabel] || errorMsg} required={isRequired}>{label}</InputLabel>
            <Select
                id={hookFormLabel}
                {...register(`${hookFormLabel}`, {
                    required: isRequired && 'Please select an option',
                })}
                error={errors[hookFormLabel] || errorMsg}
                label={label}
                name={label}
                multiple={multiSelector}
                value={stateValue}
                onBlur={() => trigger(hookFormLabel)}
                onChange={multiSelector ? handleMultiSelectorChange : handleChange}
                renderValue={renderValue}
            >
                {!multiSelector && options.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
                {multiSelector && options.map((option) => (
                    <MenuItem key={option} value={option}>
                        <Checkbox checked={stateValue.indexOf(option) > -1} />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))
                }
            </Select>
            {errors[hookFormLabel] && <FormHelperText error>{errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}</FormHelperText>}
        </FormControl>
    )
}

export default DropDown
