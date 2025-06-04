import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js'
import Box from '@mui/material/Box';
import { Autocomplete, TextField } from '@mui/material';

const SingleSelect = ({ useForm, trigger, field, sectionName, name }) => {
    const { label, placeholder, isRequired, errorMessage, conditionalOptions, options = [] } = field;

    const { register, errors, setValue, errorMsg, reset, watch, Controller, control } = useForm //to get useForm objects and function of RHF.
    const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them.

    const showError = (errors[hookFormLabel] || errorMsg) ? true : false

    const dispatch = useDispatch();
    const stateValue = useSelector((state) => {
        const section = state.form.find(obj => obj.sectionName === sectionName);
        const questionObj = name ? section?.responses.find(obj => obj.question === name).answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
        // questionObj.answer && setValue(hookFormLabel,questionObj?.answer)
        return questionObj?.answer;
    }, shallowEqual)
    // setValue(hookFormLabel,stateValue)
    const handleChange = async (event, newValue) => {
        const question = label;
        const answer = newValue;
        setValue(hookFormLabel, answer)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }

    const condOptions = useSelector((state) => {
        const result = conditionalOptions?.filter((item) => {
            const section = state.form?.find(obj => obj.sectionName === sectionName);
            const show = item.check?.map((checkItem) => {
                const questionObj = name ? section?.responses?.find(obj => obj?.question === name).answer?.find(obj => obj.question === checkItem?.label) : section?.responses?.find(obj => obj?.question === checkItem?.label);
                return questionObj?.answer === checkItem?.value;
            })
            return show.every(element => element === true);
        })
        if (result?.length > 0) {
            return result.flatMap(item => item.options);
        }
        // return [];
    }, shallowEqual)

    // const data = condOptions ? condOptions.map(item => ({ label: item, value: item })) : options?.map(item => ({ label: item, value: item }))

    useEffect(() => {
        setValue(hookFormLabel, stateValue);
    }, [stateValue])

    return (
        <Box>
            <InputLabel id="demo-select-small-label" style={{ width: '100%', position: 'relative', top: '6px', color: 'black', marginLeft: '11px' }} error={showError} required={isRequired}>{label}
            </InputLabel>
            <FormControl sx={{ fontSize: 14, width: '100%', margin: '10px' }} size='small' >
                {/* <div style={{ border: "1px solid rgba(0, 0, 0, 0.3)", borderRadius: '3px', height: '38px', width: '100%', color: 'grey' }}> */}

                <Controller
                    name={hookFormLabel}
                    control={control}
                    defaultValue={
                        (condOptions ?? options)?.find(opt => opt.value === stateValue) || null
                    }
                    rules={{
                        required: isRequired && "Please select an option",
                    }}
                    render={({ field }) => (
                        <Autocomplete
                            {...field}
                            id={hookFormLabel}
                            size='small'
                            value={stateValue || null}
                            options={condOptions ?? options}
                            onChange={handleChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size='small'
                                />
                            )}
                        />
                    )}
                />


                {/* </div> */}
                {errors[hookFormLabel] && <FormHelperText error>{errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}</FormHelperText>}
            </FormControl>
        </Box >
    )
}
export default SingleSelect;