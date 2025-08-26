import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

function TextLocalization({ imageData, onTextExtracted}) {
  const [localizedImageData, setLocalizedImageData] = useState(null);
  const [localizedImageWithBoxes, setLocalizedImageWithBoxes] = useState(null);
  const [extractedTextArray, setExtractedTextArray] = useState([]);

  useEffect(() => {
    if (imageData) {
      localizeText(imageData);
    }
  }, [imageData]);

  useEffect(() => {
    if (extractedTextArray.length > 0) {
      // Pass the extracted text array to the parent component
      onTextExtracted(extractedTextArray);
    }
  }, [extractedTextArray, onTextExtracted]);
  
  const localizeText = async (imageData) => {
    const originalImage = new Image();
    originalImage.src = imageData;

    originalImage.onload = async () => {
      const worker = await createWorker();

      try {
        const { data: allData } = await worker.recognize(originalImage);

         // Split the recognized text into an array using new lines and filter out empty strings
      const extractedTextArray = allData.text.split('\n').filter((text) => text.trim() !== '').map((text) => {
        return /[a-z]/.test(text) ? text.toUpperCase() : text;
      });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        context.drawImage(originalImage, 0, 0);
        context.strokeStyle = 'blue';
        context.fillStyle = 'orange';
        context.lineWidth = 1;
        context.font = '16px Arial';

        allData.words.forEach((word) => {
          context.strokeRect(
            word.bbox.x0,
            word.bbox.y0,
            word.bbox.x1 - word.bbox.x0,
            word.bbox.y1 - word.bbox.y0
          );

          const displayText = word.text.length > 0 ? word.text : '?';
          context.fillText(displayText, word.bbox.x0 + 20, word.bbox.y0 - 5);
        });

        const imageWithBoxes = canvas.toDataURL('image/jpeg');

        setLocalizedImageData({
          allText: allData.text.toUpperCase(),
        });
        setLocalizedImageWithBoxes(imageWithBoxes);
        setExtractedTextArray(extractedTextArray);
      } catch (error) {
        console.error('Error recognizing text:', error);
      } finally {
        await worker.terminate();
      }
    };
  };

  return (
    <div>
      {localizedImageData && (
        <div>
          <img
            src={localizedImageWithBoxes}
            alt="Localized"
            style={{ maxWidth: '100%' }}
          />
          <div>
            <h3>All Extracted Text:</h3>
            <ul>
              {extractedTextArray.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextLocalization;
