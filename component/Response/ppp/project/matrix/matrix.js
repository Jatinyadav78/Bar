import React, { useState, useRef } from 'react';
import Styles from './matrix.module.css'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fields from '../fields/fields.js'
import TrashIcon from '@rsuite/icons/Trash';
import { IconButton } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { Button } from '@mui/material';

const Matrix = ({ useForm, matrixIndex, trigger, field, sectionName, increaseMatrixFieldCount, decreaseMatrixFieldCount, imageUrl, fieldIndex }) => {
    const expanded = field.input.some(item => item.isRequired === true)

    return (<>
        <div className={Styles.matrix} style={{display:'flex', flexDirection:'column'}}>
            {!(field.name === 'Person') && <Accordion className={expanded ? Styles.accordianDisabled : Styles.customAccordian} defaultExpanded={expanded} disabled={expanded}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography sx={{ textTransform: "capitalize", color: "black", fontWeight: '600' }}>{field.name}</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <div className={Styles.formFields}>
                        {field.input.map((input, index) => {
                            return <Fields
                                key={index}
                                useForm={useForm}
                                trigger={trigger}
                                field={input}
                                sectionName={sectionName}
                                name={field.name + matrixIndex}//name is passed to let them know about matrix field.
                                imageUrl={imageUrl}
                            />
                        })}
                    </div>
                </AccordionDetails>
            </Accordion>}
            {field.name === 'Person' && <div style={{ display: 'flex', margin:'20px 0px' }}>
                <div style={{alignSelf:'center', fontWeight:'600'}}>{matrixIndex + 1}.</div>
                <div className={Styles.formFields}>
                    {field.input.map((input, index) => {
                        return <Fields
                            key={index}
                            useForm={useForm}
                            trigger={trigger}
                            field={input}
                            sectionName={sectionName}
                            name={field.name + matrixIndex}//name is passed to let them know about matrix field.
                            imageUrl={imageUrl}
                            fieldIndex={fieldIndex}
                        />
                    })}
                </div>
                <IconButton icon={<Icon as={TrashIcon} />} type='button' style={{ color: 'red' }} onClick={() => decreaseMatrixFieldCount(sectionName, field.name, matrixIndex)} />
            </div>}
           {field?.matrixAddButton && !(field.name === 'Person')  && <IconButton icon={<Icon as={TrashIcon} />} type='button' style={{ color: 'red' }} onClick={() => decreaseMatrixFieldCount(sectionName, field.name, matrixIndex)} />}
            {(field?.matrixAddButton && (field.matrixFieldCount - 1) === matrixIndex) && <Button variant='contained' className={Styles.addButton} onClick={() => increaseMatrixFieldCount(sectionName, field.name, matrixIndex)}>+ Add {field.name}</Button>}
        </div >

    </>
    )
}

export default Matrix