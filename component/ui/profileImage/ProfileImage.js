import React, { useState, useEffect } from 'react'
import Styles from './profileImage.module.css'
import { api } from '../../../utils';
import logoImage from "../../../public/camera.svg";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formAction } from '../../../store/formSlice.js';
import imageCompression from "browser-image-compression";
import axios from 'axios';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const ProfileImage = ({ useForm, trigger, field, sectionName, name }) => {
  const [capturedImages, setCapturedImages] = useState([]);
  const { label, responseType, placeholder, isRequired, errorMessage } = field;
  const { Controller, control, register, errors, setValue, errorMsg, reset } = useForm
  const hookFormLabel = name ? `${name}${label}` : label;
  const dispatch = useDispatch();
  const showError = (errors[hookFormLabel] || errorMsg) ? true : false;

  // Set max images based on sectionName
  const maxImages = sectionName === "Registration" ? 1 : 4;

  const stateValue = useSelector((state) => {
    const section = state.form.find(obj => obj.sectionName === sectionName);
    const questionObj = name ? section?.responses.find(obj => obj.question === name)?.answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);
    return questionObj?.answer || null;
  }, shallowEqual);

  const addImage = async (compressedImage) => {
    const formData = new FormData();
    formData.append("image", compressedImage);
    if(sectionName === 'Registration') formData.append('upload', 'person');
    let url = sectionName === 'Registration' ? 'v1/work-permit/organizations/upload-image' : 'v1/safety/upload';
    try {
      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Image upload error:", error);
    }
  }

  const handleFileChange = async (event) => {
    try {
      const question = label;
      let files = Array.from(event.target.files);
      // Only allow up to maxImages
      if (capturedImages.length >= maxImages) {
        alert(`You can only upload up to ${maxImages} image${maxImages > 1 ? 's' : ''}.`);
        return;
      }
      // Limit files to the remaining slots
      files = files.slice(0, maxImages - capturedImages.length);
      let uploadedFiles = [];
      for (const file of files) {
        const compressedImage = await imageCompression(file, { maxSizeMB: 2, });
        if (compressedImage.size > 2048 * 2048) {
          alert("File size exceeds 2MB. Please select a smaller file.");
          continue;
        }
        const src = URL.createObjectURL(file);
        setCapturedImages(prev => [...prev, src]);
        const response = await addImage(file); ['', '']
        let answer; 
        if(sectionName === 'Registration') answer = api + response?.data;
        else answer = api + response?.data?.data;
        console.log(response, 'response');
        uploadedFiles.push(answer);
      }
      if(sectionName === 'Registration' && uploadedFiles?.length) {
        uploadedFiles = uploadedFiles[0];
      }

      let multiple = true;
      if(sectionName === 'Registration') multiple = false;
      console.log({uploadedFiles, multiple});
      name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer: uploadedFiles })) :
          dispatch(formAction.updateField({ sectionName, question, answer: uploadedFiles, multiple }));
    } catch (error) {

    // let errorMessage = "An error occured while processing the image. Please try again.",

      console.error("error in compressing image:", error)
    }
  };

  const removeImage = (index) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={Styles.body}>
      <div className={Styles.imageContainer}>
        {capturedImages.map((src, index) => (
          <div key={index} className={Styles.imageWrapper}>
            <img
              src={src}
              alt={`Uploaded ${index + 1}`}
            />
            <button 
              type="button" 
              onClick={() => removeImage(index)}
              className={Styles.removeButton}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        
        <label
          htmlFor={hookFormLabel}
          className={Styles.uploadButton}
          style={{ cursor: capturedImages.length >= maxImages ? 'not-allowed' : 'pointer', opacity: capturedImages.length >= maxImages ? 0.5 : 1 }}
        >
          <AddPhotoAlternateIcon style={{ fontSize: 40, color: '#666' }} />
          <span>Add Photo</span>
          <input
            type="file"
            id={hookFormLabel}
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple={maxImages > 1}
            disabled={capturedImages.length >= maxImages}
            // Only allow the correct number of files to be selected
            {...(maxImages > 1 ? { max: maxImages - capturedImages.length } : {})}
          />
        </label>
      </div>
    </div>
  )
}

export default ProfileImage


