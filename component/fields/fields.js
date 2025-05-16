import React from 'react';
import Styles from './fields.module.css'
import Grid from '@mui/material/Grid';
import Textfield from '../ui/textfield/textfield.js'
import RadioField from '../ui/radio/radio.js'
import CheckboxField from '../ui/checkbox/checkbox.js'
import ImageField from '../ui/imageField/imageField.js';
import Separator from '../ui/separator/separator.js';
import DateRange from '../ui/dateRange/dateRange.js'
import TimeRange from '../ui/timeRange/timeRange.js';
import DateTimeRange from '../ui/dateTimeRange/dateTimeRange.js'
import Select from '../ui/dropdown/singleselect.js'
import Multiselect from '../ui/dropdown/multiselect.js';
import ProfileImage from '../ui/profileImage/ProfileImage.js'
import { useDispatch, useSelector } from 'react-redux';
import DateAndTimePicker from '../ui/dateAndTime/DateAndTimePicker.js';
import { formAction } from '../../store/formSlice.js';
//i have send req in post api like in this form
const field = {
    responseType: 'radioInspection',
    label: 'is electrical parts are available',
    options: ['No', 'Yes', 'NA']
}
const enumResponseType = [
    // 'select',
    'textarea',
    // 'multiSelect',
    // 'date',
    'hidden',
    // 'email',
    // 'separator',
    // 'image',
    // 'number',
    // 'password',
    'search',
    // 'dateRange',
    'url',
    // 'text',
    // 'radio',
    'file',
    // 'checkbox',
    // 'matrix',
    'notification'];

const Fields = ({ useForm, trigger, field, sectionName, name, imageUrl, fieldIndex }) => {
    const { label, responseType, placeholder, visibleIf, options = [] } = field;
    const textfieldResponseType = ['text', 'number', 'date', 'password', 'email', 'time']
    const dispatch = useDispatch();

    const visible = useSelector((state) => {
        if (!visibleIf) {
            return true;
        }
        const check = visibleIf?.map((item) => {
            const section = state.form.find(obj => obj.sectionName === sectionName);
            const questionObj = name ? section?.responses.find(obj => obj?.question === name).answer.find(obj => obj.question === item?.label) : section?.responses.find(obj => obj?.question === item?.label);
            return questionObj?.answer === item?.value;
        })
        return check.every(element => element === true);
    })

    // if(!visible){
    //     name ? dispatch(formAction.updateMatrixField({ name, sectionName, label, answer:'' })) :dispatch(formAction.updateField({ sectionName, label, answer:'' }));
    // }
    // console.log("visible:", visible)
    return (
        <>
            {visible && <Grid className={`${Styles.fields} ${responseType === 'image' && Styles.image} ${responseType === 'separator' && Styles.seperator}  ${responseType === 'inspection' && Styles.seperator}`}>
                {textfieldResponseType.includes(responseType) && (
                    <Textfield
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'select' && (
                    <Select
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'multiSelect' && (
                    <Multiselect
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {(responseType === 'radio' || responseType === 'inspection') && (
                    <RadioField
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                        fieldIndex={fieldIndex}
                    />
                )}
                {responseType === 'checkbox' && (
                    <CheckboxField
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'separator' && (
                    <Separator
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                    />
                )}
                {responseType === 'image' && (
                    <ImageField
                        field={field}
                        sectionName={sectionName}
                        name={name}
                        imageUrl={imageUrl}
                    />
                )}
                {responseType === 'profileImage' && (
                    <ProfileImage
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'dateRange' && (
                    <DateRange
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'timeRange' && (
                    <TimeRange
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'dateTimeRange' && (
                    <DateTimeRange
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
                {responseType === 'dateAndTime' && (
                    <DateAndTimePicker
                        useForm={useForm}
                        trigger={trigger}
                        field={field}
                        sectionName={sectionName}
                        name={name}
                    />
                )}
            </Grid>}
        </>
    )
}

export default Fields