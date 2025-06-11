import Layout from "../../../component/layout/layout";

export default function FirDashboardLayout({ children }) {
    return <Layout>{children}</Layout>
}

// import React, { useState, useEffect } from 'react'
// import Styles from './profileImage.module.css'
// import { api } from '../../../utils';
// import logoImage from "../../../public/camera.svg";
// import { useSelector, useDispatch, shallowEqual } from 'react-redux';
// import { formAction } from '../../../store/formSlice.js';
// import imageCompression from "browser-image-compression";
// import axios from 'axios';

// const ProfileImage = ({ useForm, trigger, field, sectionName, name }) => {
//   const [capturedImages, setCapturedImages] = useState(null);
//   const { label, responseType, placeholder, isRequired, errorMessage } = field;
//   const { Controller, control, register, errors, setValue, errorMsg, reset } = useForm //to get useForm objects and function of RHF.
//   const hookFormLabel = name ? `${name}${label}` : label;// If inputs in the matrix share the same label, different names are assigned in RHF(react-hook-form) to distinguish them
//   const dispatch = useDispatch();
//   const showError = (errors[hookFormLabel] || errorMsg) ? true : false

//   const stateValue = useSelector((state) => {
//     const section = state.form.find(obj => obj.sectionName === sectionName);
//     const questionObj = name ? section?.responses.find(obj => obj.question === name)?.answer.find(obj => obj.question === label) : section?.responses.find(obj => obj.question === label);

//     return questionObj?.answer || null;
//   }, shallowEqual)

//   // useEffect(() => {
//   //   reset();
//   // }, [])

//   const addImage = async (compressedImage) => {
//     const formData = new FormData();
//     formData.append("image", compressedImage);
//     formData.append('upload', 'person')
//     try {
//       const response = await axios.post(
//         `v1/work-permit/organizations/upload-image`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response;
//     } catch (error) {
//       console.error("Image upload error:", error);
//     }
//   }

//   const handleFileChange = async (event) => {
//     try {
//       const question = label;
//       const file = event.target.files[0];
//       if (file) {
//         const compressedImage = await imageCompression(file, { maxSizeMB: 1, });
//         if (compressedImage.size > 1024 * 1024) {
//           alert("File size exceeds 1MB. Please select a smaller file.");
//           return;
//         }
//         const src = URL.createObjectURL(file);
//         setCapturedImages(src)
//         const response =await addImage(file);
//         const answer = api + response?.data;
//         // addImage(file);

//         // errors[hookFormLabel] && await trigger(hookFormLabel)
//         name ? dispatch(formAction.updateMatrixField({ name, sectionName, question, answer })) :
//           dispatch(formAction.updateField({ sectionName, question, answer }));
//       }
//     } catch (error) {
//       console.error("error in compressing image:", error)
//     }
//   };

//   useEffect(() => {
//     // fetchImage();
//   }, [])
//   // console.log("stateValue::", stateValue)

//   return (
//     <div className={Styles.body}>
//       <button type='button'>
//         <label
//           htmlFor={hookFormLabel}
//           style={{ cursor: 'pointer' }}
//         >
//           <img
//             src={stateValue ? stateValue : "/camera.svg"}
//             style={{height:100, width:100}}
//             alt="logo"
//           />
//           <input
//             type="file"
//             id={hookFormLabel}
//             // name="picture"
//             accept="image/*"
//             capture="environment"
//             style={{ display: "none" }}
//             onChange={handleFileChange}
//           />
//         </label>

//       </button>
//     </div>
//   )
// }

// export default ProfileImage