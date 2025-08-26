import React, { useEffect, useState, useRef } from "react";

function TextLocalization1({ imageData, setData, api }) {
  const [text, setText] = useState([]);

  useEffect(() => {
    if (imageData) {
      handleTriggerApi();
    }
  }, [imageData]);

  useEffect(() => {
    // Check if there is text and call setData
    if (text) {
      const data = text;
      setData(data);
    }
  }, [text]);

  const detectText = async (file) => {
    try {
      const imageBase64 = await readFileAsBase64(file);
      const result = await callVisionApi(imageBase64);
      const fullTextAnnotation = result.responses[0].fullTextAnnotation;

      // Access the 'text' property of fullTextAnnotation
      const text = fullTextAnnotation ? fullTextAnnotation.text : "";

      const lines = text
        .toUpperCase()
        .split("\n")
        .map((line) => line.replace(/\s+/g, ""));

      return lines;
    } catch (error) {
      console.error("Error in detectText:", error.message);
      throw error;
    }
  };

  const handleTriggerApi = async () => {
    if (imageData) {
      try {
        const blob = await fetch(imageData).then((response) => response.blob());
        const result = await detectText(blob);
        setText(result);
        console.log(result);
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      console.error("No image selected.");
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result.split(",")[1]);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const callVisionApi = async (imageBase64) => {
    //Private key
    const apiKey = api;
    const apiUrl = process.env.NEXT_PUBLIC_PRIVATE_URL;
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  };

  return <div>{/* {text} */}</div>;
}

export default TextLocalization1;
