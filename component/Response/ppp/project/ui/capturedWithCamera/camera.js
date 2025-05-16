import React, { useState, useRef, useEffect } from "react";
import logoImage from "../../../public/camera.svg";
import Image from "next/image";
import Styles from './camera.module.css';
import { formatDate } from "../../../helperFunction/dateTimeFormat";
import axios from 'axios';
import imageCompression from "browser-image-compression";
import { api } from "../../../utils";
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
//import Loader from '../loader/loader';

const CameraCaptureWithTimestamp = ({ permitNumber }) => {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${api}v1/work-permit/permitImage?permitNumber=${permitNumber}`)
      setCapturedImages(response?.data?.image)
    } catch (error) {
      console.error("error whicle fetching images::", error)
    }
  }

  const addImage = async (compressedImage) => {
    const formData = new FormData();
    formData.append("image", compressedImage);
    try {
      const response = await axios.post(
        `v1/work-permit/upload?permitNumber=${permitNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCapturedImages(response?.data?.image)
    } catch (error) {
      console.error("Image upload error:", error);
    }
  }

  const handleFileChange = async (event) => {
    setLoading(true);
    try {
      const file = event.target.files[0];
      if (file) {
        const compressedImage = await imageCompression(file, { maxSizeMB: 1, });
        if (compressedImage.size > 1024 * 1024) {
          alert("File size exceeds 1MB. Please select a smaller file.");
          return;
        }
        await addImage(file);
      }
    } catch (error) {
      console.error("error in compressing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      const reqBody = {
        permitNumber,
        url: imageUrl
      }
      const response = await axios.put(`v1/work-permit/updateImage`, reqBody);
      if (response?.status === 200) {
        setCapturedImages((prevImages) =>
          prevImages.filter((imageData) => imageData.imageUrl !== imageUrl)
        );
      }
    } catch (error) {
      console.error("error while updating image:", error)
    }

  };

  const formattedDate = (date) => {
    const newDate = formatDate(date);
    return `${newDate.day}/${newDate.month}/${newDate.year}`
  }

  useEffect(() => {
    fetchImage();
  }, [])
  return (
    <>
      <div className={Styles.container} >
        {loading && <Loader loading={true} fullScreen />}
        <div style={{ width: '100%', padding: '20px' }}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            style={{ position: 'absolute'}}
          >
            Back
          </Button>
        </div>
        <div className={Styles.header}>
          <label
            htmlFor="picture"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? <Loader loading={true} /> : '+ Add'}
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div className={Styles.body}>
            <button onClick={() => document.getElementById("picture").click()}>
              <Image
                priority
                src={logoImage}
                alt="logo"
              />
            </button>
            <div style={{ margin: "5px", color: "red", fontSize: "75%" }}>
              File Size Limit: not more than 1Mb.
            </div>

            <div style={{ marginBottom: "10px", width: '100%' }}>
              <h6>Date</h6>
              <input
                type="text"
                value={"date"}
                className={Styles.date}
                disabled
              />
            </div>

            <div style={{ marginBottom: "10px", width: "100%" }}>
              <h6>Time</h6>
              <table className={Styles.time}>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        defaultValue={'hh'}
                      />
                    </td>
                    <td>:</td>
                    <td>
                      <input
                        type="text"
                        defaultValue={'mm'}
                      />
                    </td>
                    <td>:</td>
                    <td>
                      <input
                        type="text"
                        defaultValue={'ss'}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Display captured images */}

          {capturedImages.map((imageData, index) => (
            <div key={index} className={Styles.capturedImg}>
              <button onClick={() => handleRemoveImage(imageData.imageUrl)}>
                x
              </button>
              <div key={index} className={Styles.capturedImgContainer}>
                <img
                  style={{ marginBottom: '20px' }}
                  src={api + (imageData.imageUrl)}
                  alt={`Captured ${index}`}
                  width="160"
                  height="160"
                />
                <div style={{ marginBottom: "10px", width: '100%' }}>
                  <h6>Date</h6>
                  <input
                    type="text"
                    defaultValue={formattedDate(imageData.time)}
                    className={Styles.date}
                    disabled
                  />
                </div>
                <div style={{ marginBottom: "10px", width: '100%' }}>
                  <h6>Time</h6>
                  <table className={Styles.time}>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="text"
                            defaultValue={new Date(imageData.time).getHours()}
                          />
                        </td>
                        <td>:</td>
                        <td>
                          <input
                            type="text"
                            defaultValue={new Date(imageData.time).getMinutes()}
                          />
                        </td>
                        <td>:</td>
                        <td>
                          <input
                            type="text"
                            defaultValue={new Date(imageData.time).getSeconds()}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CameraCaptureWithTimestamp;