"use client";
import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Authenticate from "@/app/Authentication";
import Warning from "@/_Components/Default fix/warning";
import TextLocalization from "../../../../_Components/TestPaper/components/textLocalization";

const ImageInput = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const webcamRef = useRef(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  const [retrievedImageData, setRetrievedImageData] = useState([]);
  const [imageData1, setImageData1] = useState(null);
  const [imageData2, setImageData2] = useState(null);
  const [imageData3, setImageData3] = useState(null);
  const [imageData4, setImageData4] = useState(null);
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [array3, setArray3] = useState([]);
  const [array4, setArray4] = useState([]);
  const [combinedTextArray, setCombinedTextArray] = useState([]);

  const handleTextExtracted1 = (textArray) => {
    // Set the new text array as the combinedTextArray
    setArray1(textArray);
  };

  const handleTextExtracted2 = (textArray) => {
    // Set the new text array as the combinedTextArray
    setArray2(textArray);
  };

  const handleTextExtracted3 = (textArray) => {
    // Set the new text array as the combinedTextArray
    setArray3(textArray);
  };

  const handleTextExtracted4 = (textArray) => {
    // Set the new text array as the combinedTextArray
    setArray4(textArray);
  };

  useEffect(() => {
    if (retrievedImageData && retrievedImageData.length >= 4) {
      setImageData1(retrievedImageData[0]);
      setImageData2(retrievedImageData[1]);
      setImageData3(retrievedImageData[2]);
      setImageData4(retrievedImageData[3]);
    }
  }, [retrievedImageData]);

  const combineArrays = () => {
    // Concatenate array1 to array4 into a single array
    const combinedArray = [
      ...array1,
      ...array2.map((text) => text.replace(/\s/g, '')),
      ...array3.map((text) => text.replace(/\s/g, '')),
      ...array4.map((text) => text.replace(/\s/g, '')),
    ];
    // Update the state of combinedTextArray
    setCombinedTextArray(combinedArray);
  };
  useEffect(() => {
    // Call combineArrays whenever any of the array states change
    combineArrays();
  }, [array1, array2, array3, array4]);
  
  const toggleWebcam = () => {
    setWebcamEnabled(!webcamEnabled);
  };

  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setWebcamEnabled(true);

      // Add the new image to the existing retrievedImages array
      setRetrievedImages((prevImages) => [
        ...prevImages,
        dataURItoBlob(imageSrc),
      ]);
      setRetrievedImageData((prevImages) => [
        ...prevImages,
        dataURItoBlob(imageSrc),
      ]);
      // Upload all images
      uploadImage(retrievedImages);
    }
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    uploadImage(imageFile);
  };

  const uploadImage = async (imageDataArray) => {
    try {
      const formData = new FormData();

      if (Array.isArray(imageDataArray)) {
        // If imageDataArray is an array, append each image to the formData
        imageDataArray.forEach((imageData, index) => {
          formData.append(`image${index + 1}`, imageData);
        });
      } else {
        // If imageDataArray is a single image, append it to the formData
        formData.append("image", imageDataArray);
      }

      await axios.post("http://localhost:3002/post-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After posting, trigger the getImage function for all images
      getImages();
    } catch (error) {
      console.error("Error posting images:", error);
    }
  };

  const getImages = async () => {
    try {
      const images = [];
      for (let i = 0; i < 4; i++) {
        const response = await axios.get(
          `http://localhost:3002/get-image?index=${i}`,
          {
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);
        images.push(imageUrl);
      }
      setRetrievedImages(images);
      setRetrievedImageData(images);
    } catch (error) {
      console.error("Error getting images:", error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      uploadImage(selectedImage);
    }
  }, [selectedImage]);

  useEffect(() => {
    let processingIndex = 0;
    let pauseProcessing = false;

    const processImages = async () => {
      if (processingIndex < retrievedImages.length) {
        // Process the current image
        onImageSelected(retrievedImages[processingIndex]);

        // Simulate a 10-second delay before processing the next image
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Remove the processed image by index
        setRetrievedImages((prevImages) =>
          prevImages.filter((image, index) => index !== processingIndex)
        );
        setRetrievedImageData((prevImages) =>
          prevImages.filter((image, index) => index !== processingIndex)
        );
        
        processingIndex++;

        // Check if processing should be paused
        if (processingIndex >= 4) {
          pauseProcessing = true;
        }

        // Recursively call processImages if processing should continue
        if (!pauseProcessing) {
          processImages();
        } else {
          setRetrievedImages([]);
        }
      }
    };

    if (retrievedImages.length > 0) {
      processImages();
    }
  }, [retrievedImages, onImageSelected]);

  return (
    <>
      <Warning />
      <div>
        {/* File input */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Webcam component */}
        {webcamEnabled ? (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <br />
            <button onClick={capture}>Capture Image</button>
            <button onClick={toggleWebcam} className="disable-webcam-button">
              Disable Webcam
            </button>
          </div>
        ) : (
          <button onClick={toggleWebcam} className="enable-webcam-button">
            Enable Webcam
          </button>
        )}

        <TextLocalization imageData={imageData1} onTextExtracted={handleTextExtracted1} />
        <TextLocalization imageData={imageData2} onTextExtracted={handleTextExtracted2} />
        <TextLocalization imageData={imageData3} onTextExtracted={handleTextExtracted3} />
        <TextLocalization imageData={imageData4} onTextExtracted={handleTextExtracted4} />
        <div>
        <h3>Combined Extracted Text:</h3>
        <ul>
          {combinedTextArray.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
        </div>
      </div>
    </>
  );
}

export default Authenticate(ImageInput);

// Utility function to convert data URI to Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
