import React, { useEffect } from 'react';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Styles from './radio.module.css';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js'

const RadioField = ({ useForm, trigger, field, sectionName, name, fieldIndex }) => {
    const { label, responseType, placeholder, isRequired, errorMessage, options = [] } = field;
    const { Controller, control, register, errors, setValue, errorMsg, reset, watch } = useForm //to get useForm objects and function of RHF.

    const getFirstThreeWords = (input) => {
        // Remove special characters and extra spaces
        const sanitizedInput = input.replace(/[^a-zA-Z0-9\s]/g, '').trim();

        // Split the string into words
        const words = sanitizedInput.split(/\s+/);

        // Get the first 3 words and join them into a single string
        return words.slice(0, 3).join('');
    }

    const hookFormLabel = name ? `${name}${getFirstThreeWords(label)}` + fieldIndex : getFirstThreeWords(label) + fieldIndex;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them.
    const dispatch = useDispatch();
    const showError = (errors[hookFormLabel] || errorMsg) ? true : false


    const stateValue = useSelector((state) => {
        const section = state.form.find(obj => obj.sectionName === sectionName);
        const questionObj = name ? section?.responses.find(obj => obj.question === name)?.answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);

        return questionObj?.answer || '';
    }, shallowEqual)

    const textChange = async (event) => {
        const question = event?.target?.name || label;
        const answer = event?.target?.value || options[0];
        // setValue(hookFormLabel, answer)
        errors[hookFormLabel] && await trigger(hookFormLabel)
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
            dispatch(formAction.updateField({ sectionName, question, answer }));
    }

      useEffect(() => {
          setValue(hookFormLabel, stateValue);
        }, [stateValue])

    return (
        <FormControl className={responseType === 'inspection' ? Styles.inspection : null} sx={{ fontSize: 14, width: '100%', margin: '8px' }} size='small'>
            <FormLabel sx={{ marginRight: '50px', color: 'black' }} id="demo-row-radio-buttons-group-label" required={isRequired} error={showError} >{label} </FormLabel>
            <Controller
                name={hookFormLabel}
                control={control}
                defaultValue={stateValue}
                rules={{ required: { value: isRequired, message: 'This field is required' } }}
                render={({ field }) => (
                    <RadioGroup
                        {...field}
                        className={Styles.options}
                        row
                        aria-label={label}
                        id={hookFormLabel}
                        name={label}
                        value={stateValue}
                        onChange={(e) => {
                            field.onChange(e);
                            setValue(hookFormLabel, e.target.value)
                            textChange(e); // Call the function on change
                        }}
                    >
                        {options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio sx={{
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 18,
                                    },
                                }} />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                )}
            />
            {errors[hookFormLabel] && <FormHelperText error>{errors[hookFormLabel] ? errors[hookFormLabel].message : errorMsg}</FormHelperText>}
        </FormControl>
    )
}

export default RadioField