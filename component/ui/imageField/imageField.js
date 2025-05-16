import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { formAction } from '../../../store/formSlice';
import Styles from './imageField.module.css';
import axios from "axios";
import { useSearchParams } from 'next/navigation.js';

const ImageField = ({ field, sectionName, name, imageUrl }) => {
    const dispatch = useDispatch();
    const { label, errorMessage } = field
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    const addImage = async () => {
        name ? dispatch(formAction.updateMatrixField({ name, sectionName, question: label, answer: imageUrl })) : dispatch(formAction.updateField({ sectionName, question: label, answer: imageUrl }));
    }
    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };
    useEffect(() => {
        if(imageUrl){
            addImage()
        }
    }, [imageUrl])
    return (
        <>
            <div className={`${Styles.container}`}>
                <div className={Styles.image}>
                    <img
                        alt="Plant Layout"
                        src={imageUrl ? imageUrl : ''}
                        width="100%"
                        height="100%"
                    // layout='fill'
                    />

                </div>
                <div className={Styles.fullScreenBtn} onClick={toggleFullScreen}>
                    <div style={{ marginRight: '2px', lineHeight: '0px' }}>
                        <p>&#129124;</p>
                        <p>&#129127;</p>
                    </div>
                    <div style={{ lineHeight: '0px' }} >
                        <p>&#129125;</p>
                        <p>&#129126;</p>
                    </div>
                </div>
            </div>
            {isFullScreen && (
                <div className={Styles.overlay} onClick={toggleFullScreen}>
                    <span className={Styles.close} onClick={toggleFullScreen}>&times;</span>
                    <img
                        alt="Plant Layout"
                        src={imageUrl}
                        width="100%"
                        height="100%"
                        className={Styles.overlayContent} />
                </div>
            )}
        </>
    )
}

export default ImageField