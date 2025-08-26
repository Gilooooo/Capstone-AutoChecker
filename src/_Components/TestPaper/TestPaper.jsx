"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { useTUPCID } from "@/app/Provider";
import axios from "axios";

const QA = ({ setBack }) => {
  const { TUPCID } = useTUPCID();
  const searchparams = useSearchParams();
  const testname = searchparams.get("testname");
  const sectionname = searchparams.get("sectionname");
  const uid = searchparams.get("uid");
  const subject = searchparams.get("subject");
  const semester = searchparams.get("semester");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage3, setErrorMessage3] = useState("");
  const [loadedFromLocalStorage, setLoadedFromLocalStorage] = useState(false);
  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [savedValues, setSavedValues] = useState([]);

  const handleSaveToDocsAndPDF = () => {
    const localStorageKey = `testPaperData_${TUPCID}_${sectionname}_${uid}`;
    const savedData = JSON.parse(localStorage.getItem(localStorageKey) || "[]");

    generateTestPaperdoc(savedData);
  };
  const generateTestPaperdoc = async () => {
    const generateWord = document.getElementById("generateWord").checked;
    const generatePDF = document.getElementById("generatePDF").checked;

    if (!generateWord && !generatePDF) {
      alert(
        "Please check at least one option (Word or PDF) before downloading the file."
      );
    } else {
      if (generateWord) {
        try {
          const response = await fetch(
            `http://localhost:3001/generateTestPaperdoc/${uid}`
          );

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${testname}_testpaper.docx`;
            a.click();
          } else {
            console.error("Failed to generate Word document.");
          }
        } catch (error) {
          console.error("Error generating Word document:", error);
        }
      }

      if (generatePDF) {
        // Generate and download the PDF document as before
        try {
          const response = await fetch(
            `http://localhost:3001/generateTestPaperpdf/${uid}`
          );

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${testname}_testpaper.pdf`;
            a.click();
          } else {
            console.error("Failed to generate PDF.");
          }
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      }
    }
  };
  const questionTypes = [
    { value: "MultipleChoice", label: "Multiple Choice" },
    { value: "TrueFalse", label: "True/False" },
    { value: "Identification", label: "Identification" },
  ];
  const [fields, setFields] = useState([
    {
      questionType: questionTypes[0],
      question: "",
      answer: "",
      score: "1",
      copiedFields: [],
      MCOptions: [
        { label: "A", text: "" },
        { label: "B", text: "" },
        { label: "C", text: "" },
        { label: "D", text: "" },
      ],
      TFOptions: [{ label: "T" }, { label: "F" }],
    },
  ]);

  const localStorageKey = `testPaperData_${TUPCID}_${sectionname}_${uid}`;
  const localStorageKey2 = `TData_${TUPCID}_${sectionname}_${uid}`;
  const localStorageKey3 = `QData_${TUPCID}_${sectionname}_${uid}`;
  const localStorageKey4 = `SData_${TUPCID}_${sectionname}_${uid}`;

  useEffect(() => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      setFields(JSON.parse(savedData));
      setLoadedFromLocalStorage(true);
    }
  }, [localStorageKey]);

  // Modified code to save and retrieve fieldTitleNumbers
  const [fieldTitleNumbers, setFieldTitleNumbers] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const savedFieldTitleNumbers = localStorage.getItem(localStorageKey2);
      return savedFieldTitleNumbers ? JSON.parse(savedFieldTitleNumbers) : [1];
    } else {
      return [1];
    }
  });

  // Modified code to save and retrieve fieldQuestionNumbers
  const [fieldQuestionNumbers, setFieldQuestionNumbers] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const savedFieldQuestionNumbers = localStorage.getItem(localStorageKey3);
      return savedFieldQuestionNumbers
        ? JSON.parse(savedFieldQuestionNumbers)
        : [1];
    } else {
      return [1];
    }
  });

  // Modified useEffect to save fieldTitleNumbers and fieldQuestionNumbers
  useEffect(() => {
    if (!fieldTitleNumbers && !fieldQuestionNumbers) return;
    localStorage.setItem(localStorageKey2, JSON.stringify(fieldTitleNumbers));
    localStorage.setItem(
      localStorageKey3,
      JSON.stringify(fieldQuestionNumbers)
    );
  }, [fieldTitleNumbers, fieldQuestionNumbers]);

  const maxScoreFromLocalStorage = localStorage.getItem(localStorageKey4);

  // Initialize `maxScore` with the value from local storage or the default value (10)
  const [maxScore, setMaxScore] = useState(
    maxScoreFromLocalStorage ? parseInt(maxScoreFromLocalStorage) : 10
  );

  // Update the `maxScore` state and save it to local storage when it changes
  const handleMaxScore = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    value = Math.max(10, parseInt(value) || 1);

    setMaxScore(value);

    // Save the updated `maxScore` to local storage
    localStorage.setItem(localStorageKey4, value);
  };

  const [totalScore, setTotalScore] = useState(0);
  const [scoreDifference, setScoreDifference] = useState(0);

  // Function to calculate and update the total score
  const updateTotalScore = () => {
    const newTotalScore = fields.reduce((acc, field) => {
      const originalScore = parseInt(field.score) || 0;
      const copiedScore = field.copiedFields.reduce(
        (copiedAcc, copiedField) => {
          return copiedAcc + (parseInt(copiedField.score) || 0);
        },
        0
      );
      return acc + originalScore + copiedScore;
    }, 0);

    // Calculate the score difference and update the state
    const newScoreDifference = maxScore - newTotalScore;
    setScoreDifference(newScoreDifference);
    setTotalScore(newTotalScore);
  };

  useEffect(() => {
    // Update the total score whenever the fields change
    updateTotalScore();
  }, [maxScore, fields]);

  const addNewField = () => {
    if (fieldTitleNumbers.length > 2) {
      alert("Already reach the maximum type of test");
      return;
    }

    let newQuestionType = questionTypes[1]; // Default to True/False
    const hasMultipleChoice = fields.some(
      (field) => field.questionType?.value === "MultipleChoice"
    );
    const hasTrueFalse = fields.some(
      (field) => field.questionType?.value === "TrueFalse"
    );
    if (!hasMultipleChoice) {
      newQuestionType = questionTypes[0];
    } else if (!hasTrueFalse) {
      newQuestionType = questionTypes[1];
    } else {
      newQuestionType = questionTypes[2];
    }

    const newFieldNumber = fieldTitleNumbers.length + 1;
    setFields((prevFields) => [
      ...prevFields,
      {
        questionType: newQuestionType,
        question: "",
        answer: "",
        score: "1",
        copiedFields: [],
        MCOptions: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
        ],
        TFOptions: [{ label: "T" }, { label: "F" }],
      },
    ]);

    updateTotalScore();

    setFieldTitleNumbers((prevNumbers) => [...prevNumbers, newFieldNumber]);
    setFieldQuestionNumbers((prevNumbers) => [...prevNumbers, 1]);
  };

  const getExistingQuestionTypes = (currentFieldIndex) => {
    const existingTypes = new Set();

    fields.forEach((field, index) => {
      if (index !== currentFieldIndex && field.questionType) {
        existingTypes.add(field.questionType.value);
      }
    });

    return existingTypes;
  };

  const handleFieldChange = (index, field) => {
    const updatedFields = [...fields];

    // Ensure the score is at least 1
    const score = Math.min(Math.max(1, parseInt(field.score) || 1), 10);
    updatedFields[index] = { ...field, score: score };

    if (field.questionType && field.questionType.value === "TrueFalse") {
      updatedFields[index].answer = field.answer;
    } else if (
      field.questionType &&
      field.questionType.value === "MultipleChoice"
    ) {
      updatedFields[index].answer = field.answer;

      // Update the answer for each option
      updatedFields[index].MCOptions.forEach((option, optionIndex) => {
        if (option.label === field.answer) {
          option.text = field.MCOptions[optionIndex].text;
        }
      });
    } else {
      // Preserve the score for copied fields
      field.copiedFields.forEach((copiedField) => {
        copiedField.score = score;
      });
    }
    setFields(updatedFields);
    updateTotalScore();
    setSaveButtonDisabled(false);
  };

  const addRadioOption = (index, copiedIndex) => {
    const updatedFields = [...fields];
    if (copiedIndex === undefined) {
      if (!updatedFields[index].MCOptions) {
        updatedFields[index].MCOptions = [];
      }
      if (updatedFields[index].MCOptions.length < 5) {
        const newOption = String.fromCharCode(
          65 + updatedFields[index].MCOptions.length
        );
        updatedFields[index].MCOptions.push({ label: newOption, text: "" });
        setFields(updatedFields);
      } else {
        console.error("Cannot add more options. Maximum of 5 options allowed.");
      }
    } else {
      if (!updatedFields[index].copiedFields[copiedIndex].MCOptions) {
        updatedFields[index].copiedFields[copiedIndex].MCOptions = [];
      }
      if (updatedFields[index].copiedFields[copiedIndex].MCOptions.length < 5) {
        const newOption = String.fromCharCode(
          65 + updatedFields[index].copiedFields[copiedIndex].MCOptions.length
        );
        updatedFields[index].copiedFields[copiedIndex].MCOptions.push({
          label: newOption,
          text: "",
        });
        setFields(updatedFields);
      } else {
        console.error("Cannot add more options. Maximum of 5 options allowed.");
      }
    }
  };

  const subtractRadioOption = (index, copiedIndex) => {
    const updatedFields = [...fields];

    if (copiedIndex === undefined) {
      if (updatedFields[index].MCOptions.length > 3) {
        updatedFields[index].MCOptions.pop();
      } else {
        console.error("Cannot subtract option. Minimum of 3 options required.");
      }
    } else if (
      updatedFields[index].copiedFields &&
      updatedFields[index].copiedFields[copiedIndex].MCOptions
    ) {
      if (updatedFields[index].copiedFields[copiedIndex].MCOptions.length > 3) {
        updatedFields[index].copiedFields[copiedIndex].MCOptions.pop();
      } else {
        console.error("Cannot subtract option. Minimum of 3 options required.");
      }
    }
    setFields(updatedFields);
  };

  const handleOptionTextChange = (index, optionIndex, text) => {
    const updatedFields = [...fields];
    if (
      updatedFields[index].MCOptions &&
      updatedFields[index].MCOptions[optionIndex]
    ) {
      updatedFields[index].MCOptions[optionIndex].text = text;
      setFields(updatedFields);
    }
  };

  const handleOptionTextChangeForCopiedField = (
    index,
    copiedIndex,
    optionIndex,
    text
  ) => {
    const updatedFields = [...fields];
    if (
      updatedFields[index].copiedFields[copiedIndex].MCOptions &&
      updatedFields[index].copiedFields[copiedIndex].MCOptions[optionIndex]
    ) {
      updatedFields[index].copiedFields[copiedIndex].MCOptions[
        optionIndex
      ].text = text;
      setFields(updatedFields);
    }
  };

  const handleCopyField = (index, copiedIndex) => {
    const updatedFields = [...fields];
    const copiedField = {
      ...fields[index],
      question: "",
      answer: "",
      copiedFields: [],
      score: defaultScores[fields[index].questionType?.value] || 1,
    };

    // If the question type is "MultipleChoice," initialize MCOptions with default choices
    if (copiedField.questionType.value === "MultipleChoice") {
      copiedField.MCOptions = [
        { label: "A", text: "" },
        { label: "B", text: "" },
        { label: "C", text: "" },
        { label: "D", text: "" },
      ];
    }

    if (updatedFields[index].copiedFields.length >= 19) {
      return;
    }

    if (!updatedFields[index].copiedFields) {
      updatedFields[index].copiedFields = [];
    }
    updatedFields[index].copiedFields.splice(copiedIndex + 1, 0, copiedField);

    setFields(updatedFields);
    updateTotalScore();
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleCopyFieldData = (index, copiedIndex) => {
    const updatedFields = [...fields];

    if (!updatedFields[index].copiedFields) {
      updatedFields[index].copiedFields = [];
    }

    const sourceQuestion =
      copiedIndex === undefined
        ? updatedFields[index]
        : updatedFields[index].copiedFields[copiedIndex];

    const originalLabels = sourceQuestion.MCOptions.map(
      (option) => option.label
    );
    const shuffledLabels = shuffleArray(originalLabels);

    // Create a new set of MCOptions with shuffled text but original labels
    const shuffledMCOptions = sourceQuestion.MCOptions.map(
      (option, optionIndex) => ({
        label: option.label,
        text: sourceQuestion.MCOptions.find(
          (originalOption) =>
            originalOption.label === shuffledLabels[optionIndex]
        ).text,
      })
    );

    const copiedData = {
      questionType: sourceQuestion.questionType,
      question: sourceQuestion.question,
      score: sourceQuestion.score,
      MCOptions: shuffledMCOptions,
      TFOptions: sourceQuestion.TFOptions.map((option) => ({ ...option })), // Deep copy TFOptions
    };

    if (updatedFields[index].copiedFields.length >= 19) {
      setErrorMessage("You've reach the maximum number in this question type");
      return;
    }
    if (copiedIndex === undefined) {
      updatedFields[index].copiedFields.splice(index, 0, copiedData);
    } else {
      updatedFields[index].copiedFields.splice(copiedIndex + 1, 0, copiedData);
    }

    setFields(updatedFields);
  };

  const handleReset = (index, copiedIndex) => {
    const updatedFields = [...fields];
    if (copiedIndex === undefined) {
      updatedFields[index] = {
        ...fields[index],
        question: "",
        answer: "",
        MCOptions: fields[index].MCOptions.map((option) => ({
          ...option,
          text: "", // Reset text for MultipleChoice options
        })),
      };
    } else {
      updatedFields[index].copiedFields[copiedIndex] = {
        ...fields[index].copiedFields[copiedIndex],
        question: "",
        answer: "",
        MCOptions: fields[index].copiedFields[copiedIndex].MCOptions.map(
          (option) => ({
            ...option,
            text: "", // Reset text for MultipleChoice options
          })
        ),
      };
    }
    setFields(updatedFields);
  };

  const handleRemoveCopiedField = (fieldIndex, copiedIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].copiedFields.splice(copiedIndex, 1);
    setFields(updatedFields);
    setErrorMessage("");
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);

    // Update the TYPE numbers for the remaining fields
    const updatedFieldTitleNumbers = updatedFields.map(
      (field, i) => fieldTitleNumbers[i]
    );
    const updatedFieldQuestionNumbers = updatedFields.map(
      (field, i) => fieldQuestionNumbers[i]
    );

    setFields(updatedFields);
    setFieldTitleNumbers(updatedFieldTitleNumbers);
    setFieldQuestionNumbers(updatedFieldQuestionNumbers);
  };

  const handleQuestionTypeChange = (index, selectedOption) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      questionType: selectedOption,
      question: "",
      answer: "",
      score: "1",
      copiedFields: [],
      MCOptions: [
        { label: "A", text: "" },
        { label: "B", text: "" },
        { label: "C", text: "" },
        { label: "D", text: "" },
      ],
      TFOptions: [{ label: "T" }, { label: "F" }],
    };
    setFields(updatedFields);
  };

  const handleSave = async () => {
    const firstEmptyField = fields.find((field, fieldIndex) => {
      const isEmpty = (
        field.question.trim() === "" ||
        ((field.questionType?.value !== "Identification") && field.answer.trim() === "") ||
        ((field.questionType?.value === "MultipleChoice") &&
          field.MCOptions.some((option) => option.text.trim() === ""))
      );
      if (
        field.questionType?.value === "MultipleChoice" &&
        field.MCOptions.some((option, optionIndex) => option.text.trim() === "")
      ) {
        // Find the first empty MCOption
        const emptyOptionIndex = field.MCOptions.findIndex((option) => option.text.trim() === "");
    
        if (emptyOptionIndex !== -1) {
          
          // Scroll to the original MCOption with empty value
          const originalMCOptionElement = document.getElementById(`mc-option-${fieldIndex}-${emptyOptionIndex}`);
          if (originalMCOptionElement) {
            originalMCOptionElement.focus();
            originalMCOptionElement.scrollIntoView({ behavior: "smooth" });
          }
    
          return true;
        }
      }
      if (isEmpty) {
        
        // Scroll to the question or answer field with empty value
        const questionElement = document.getElementById(`question-${fieldIndex}`);
        if (questionElement) {
          questionElement.focus();
          questionElement.scrollIntoView({ behavior: "smooth" });
        } else {
          const answerElement = document.getElementById(`answer-${fieldIndex}`);
          if (answerElement) {
            answerElement.focus();
            answerElement.scrollIntoView({ behavior: "smooth" });
          } else {
            const mcOptionElement = document.getElementById(`mc-option-${fieldIndex}-0`);
            if (mcOptionElement) {
              mcOptionElement.focus();
              mcOptionElement.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
  
        return true;
      }
      
      // Check for empty values in answer textbox if the question type is "Identification"
      if (
        field.questionType?.value === "Identification" &&
        field.answer.trim() === ""
      ) {
        
        // Scroll to the answer field with empty value
        const answerElement = document.getElementById(`answer-${fieldIndex}`);
        if (answerElement) {
          answerElement.focus();
          answerElement.scrollIntoView({ behavior: "smooth" });
        }
  
        return true;
      }
      
  
      // Check copied fields for empty values
    if (field.copiedFields.length > 0) {
      const emptyCopiedField = field.copiedFields.find((copiedField, copiedIndex) => {
        // Check for empty values in copied question textbox
        if (copiedField.question.trim() === "") {
          
          // Scroll to the copied question field with empty value
          const copiedQuestionElement = document.getElementById(`copied-question-${fieldIndex}-${copiedIndex}`);
          if (copiedQuestionElement) {
            copiedQuestionElement.focus();
            copiedQuestionElement.scrollIntoView({ behavior: "smooth" });
          }

          return true;
        }

        // Check for empty values in copied answer textbox if the question type is "Identification"
        if (
          copiedField.questionType?.value === "Identification" &&
          (copiedField.answer ?? '').trim() === ""
        ) {
          
          // Scroll to the copied answer field with empty value
          const copiedAnswerElement = document.getElementById(`copied-answer-${fieldIndex}-${copiedIndex}`);
          if (copiedAnswerElement) {
            copiedAnswerElement.focus();
            copiedAnswerElement.scrollIntoView({ behavior: "smooth" });
          }

          return true;
        } 
        if (
          (copiedField.questionType?.value === "MultipleChoice" || copiedField.questionType?.value === "TrueFalse") &&
          (copiedField.answer ?? '').trim() === ""
        ) {
          
          // Scroll to the copied answer field with empty value
          const copiedAnswerElement = document.getElementById(`copied-question-${fieldIndex}-${copiedIndex}`);
          if (copiedAnswerElement) {
            copiedAnswerElement.focus();
            copiedAnswerElement.scrollIntoView({ behavior: "smooth" });
          }

          return true;
        }
        if (
          copiedField.questionType?.value === "MultipleChoice" &&
          copiedField.MCOptions.some((option, optionIndex) => option.text.trim() === "")
        ) {
          // Find the first empty MCOption
          const emptyOptionIndex = copiedField.MCOptions.findIndex((option) => option.text.trim() === "");
      
          if (emptyOptionIndex !== -1) {
            
            // Scroll to the copied MCOption with empty value
            const copiedMCOptionElement = document.getElementById(`copied-mc-option-${fieldIndex}-${copiedIndex}-${emptyOptionIndex}`);
            if (copiedMCOptionElement) {
              copiedMCOptionElement.focus();
              copiedMCOptionElement.scrollIntoView({ behavior: "smooth" });
            }
      
            return true;
          }
        }

        return false;
      });

      return !!emptyCopiedField;
    }

    return false;
  });

  if (firstEmptyField ) {
    // Prevent the saving logic from being executed
    return;
  }
  
  
  
    const localStorageKey = `testPaperData_${TUPCID}_${sectionname}_${uid}`;

    const savedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "[]"
    );

    const typeScores = {};
    localStorage.setItem(localStorageKey, JSON.stringify(fields));

    const updatedSavedValues = [];

    fields.forEach((field, index) => {
      const questionData = {
        type: `TYPE ${fieldTitleNumbers[index]}`,
        questionType: field.questionType ? field.questionType.value : null,
        questionNumber: fieldQuestionNumbers[index],
        question: field.question ? field.question : "",
        score: Math.round(parseFloat(field.score) || 0),
      };

      if (
        field.questionType &&
        field.questionType.value === "MultipleChoice"
      ) {
        questionData.options = field.MCOptions.map((option) => ({
          label: option.label,
          text: option.text ? option.text.toUpperCase() : "",
        }));

        // Save the selected answer for MultipleChoice
        questionData.answer = field.answer;
      } else {
        questionData.answer = field.answer ? field.answer.toUpperCase() : "";
      }

      updatedSavedValues.push(questionData);

      if (field.copiedFields.length > 0) {
        field.copiedFields.forEach((copiedField, copiedIndex) => {
          const copiedQuestionData = {
            type: `TYPE ${fieldTitleNumbers[index]}`,
            questionType: field.questionType
              ? field.questionType.value
              : null,
            questionNumber: fieldQuestionNumbers[index] + copiedIndex + 1,
            question: copiedField.question
              ? copiedField.question
              : "",
            score: Math.round(parseFloat(copiedField.score) || 0),
          };

          if (
            field.questionType &&
            field.questionType.value === "MultipleChoice"
          ) {
            // Save all radio button options and their text for copied fields
            copiedQuestionData.options = copiedField.MCOptions.map(
              (option) => ({
                label: option.label,
                text: option.text ? option.text.toUpperCase() : "",
              })
            );

            // Save the selected answer for copied fields
            copiedQuestionData.answer = copiedField.answer;
          } else {
            copiedQuestionData.answer = copiedField.answer
              ? copiedField.answer.toUpperCase()
              : "";
          }

          updatedSavedValues.push(copiedQuestionData);
        });
      }
    });


    savedData.forEach((data) => {
      const type = data.type;
      if (typeScores[type]) {
        typeScores[type] += data.score;
      } else {
        typeScores[type] = data.score;
      }
    });

    const totalScore = updatedSavedValues.reduce(
      (total, data) => total + data.score,
      0
    );
    const scoreDifference = maxScore - totalScore;
    const typeScores2 = { TotalScore: totalScore };
    updatedSavedValues.push(typeScores2);
    if (scoreDifference !== 0) {
      alert("Remaining score is not 0. Save aborted.");
      return;
    }
    setSaveButtonDisabled(true);

    setSavedValues(updatedSavedValues);

    try {
      console.log("createtestpaper");
      console.log(updatedSavedValues);
      const response = await axios.post(
        "http://localhost:3001/createtestpaper",
        {
          TUPCID: TUPCID,
          UID: uid,
          test_name: testname,
          section_name: sectionname,
          subject: subject,
          semester: semester,
          data: updatedSavedValues,
        }
      );

      if (response.status === 200) {
        setErrorMessage("Data saved successfully.");
      } else {
        setErrorMessage("Error saving data. Please try again.");
      }

      const savequestions = await axios.post(
        "http://localhost:3001/addtopreset",
        {
          Professor_ID: TUPCID,
          TESTNAME: testname,
          UID: uid,
          data: updatedSavedValues,
        }
      );

      if (savequestions.status === 200) {
        alert(
          "Questions save successfully. You may now access it on PRESETS button"
        );
      } else {
        alert("Error updating data. Please try again.");
      }

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      setSaveButtonDisabled(true);
    } catch (error) {
      console.error("Error saving/updating data:", error);
      setErrorMessage("Error saving/updating data. Please try again.");
    }
  };

  const openPresetPage = () => {
    // Define the URL of the Preset page
    const presetPageUrl = "/Faculty/Preset";

    // Open the Preset page in a new tab/window with specific dimensions
    const newWindow = window.open(
      presetPageUrl,
      "_blank",
      "toolbar=0,location=0,status=0,menubar=0,scrollbars=1,width=200,height=1200,top=100,left=1080"
    );
    if (newWindow) {
      newWindow.focus();
    }
  };

  const [defaultScores, setDefaultScores] = useState({
    MultipleChoice: 1,
    TrueFalse: 1,
    Identification: 1,
  });

  const [scoresPerQuestion, setScoresPerQuestion] = useState({
    MultipleChoice: 1,
    TrueFalse: 1,
    Identification: 1,
  });

  const handleDefaultScoreChange = (questionType, newScore) => {
    const parsedScore = parseInt(newScore, 10);
    const clampedScore = Math.min(Math.max(parsedScore, 1), 10);

    setDefaultScores((prevScores) => ({
      ...prevScores,
      [questionType]: clampedScore,
    }));

    // Update scores per question based on the new default score
    setScoresPerQuestion((prevScores) => ({
      ...prevScores,
      [questionType]: clampedScore,
    }));

    // Update the score of the first question of the selected question type
    const updatedFields = [...fields];
    const indexToUpdate = updatedFields.findIndex(
      (field) => field.questionType?.value === questionType
    );

    if (indexToUpdate !== -1) {
      updatedFields[indexToUpdate].score = newScore;
      setFields(updatedFields);
      updateTotalScore();
    }
  };

  const handleQuestionScoreChange = (index, copiedIndex, newScore) => {
    // Parse the newScore value to ensure it is a number
    const parsedScore = parseInt(newScore, 10);

    // Check if parsedScore is a valid number between 1 and 10
    if (!isNaN(parsedScore) && parsedScore >= 1 && parsedScore <= 10) {
      const updatedFields = [...fields];

      if (copiedIndex === undefined) {
        updatedFields[index].score = parsedScore;
      } else {
        updatedFields[index].copiedFields[copiedIndex].score = parsedScore;
      }

      setFields(updatedFields);
      updateTotalScore();
    } else {
      setErrorMessage3(
        "Invalid input: Please enter a number between 1 and 10."
      );

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setErrorMessage3("");
      }, 3000);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center container-sm col-lg-8 col-11 border border-dark rounded py-2">
      <div className="position-absolute top-0 start-0">
        <button className="btn btn-outline-dark" onClick={setBack}>
          Change Type
        </button>
      </div>
      <div className="position-absolute bottom-0 start-0 p-3">
        <i
          className="bi bi-arrow-up-square fs-2 custom-hover2"
          onClick={scrollToTop}
        ></i>
      </div>
      <div className="position-fixed bottom-0 end-0 p-3">
        <div>
          <p className="text-danger">{errorMessage3}</p>
        </div>
        <div className="card align-items-end">
          <div className="card-body">
            <p>Generate:</p>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="generateWord"
              />
              <label className="form-check-label" htmlFor="generateWord">
                Word
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="generatePDF"
              />
              <label className="form-check-label" htmlFor="generatePDF">
                PDF
              </label>
            </div>

            <button
              className="btn btn-outline-dark mt-3"
              onClick={handleSaveToDocsAndPDF}
            >
              Download
            </button>
          </div>
        </div>

        <br />
        <div className="text-end">
          <button className="btn btn-dark btn-lg" onClick={openPresetPage}>
            Test Bank
          </button>
        </div>
      </div>

      {fields.map((field, index) => (
        <fieldset className="row col-12 justify-content-center" key={index}>
          <legend className="p-0">
            TYPE {fieldTitleNumbers[index]}
            <p>
              Score: {totalScore}/{maxScore}
            </p>
            <label>TOTAL SCORE:</label>&nbsp;
            <input
              className="rounded border border-dark text-center"
              type="number"
              placeholder="Max Score (1-100)"
              value={maxScore}
              onChange={handleMaxScore}
              min="10"
              max="100"
            />
          </legend>

          <div className="row align-items-center p-0">
            <span className="col-2 p-0 ">TYPE OF TEST:</span>

            <Select
              className="col-8"
              isSearchable={ false }
              options={questionTypes.filter(
                (option) => !getExistingQuestionTypes(index).has(option.value)
              )}
              value={field.questionType}
              onChange={(selectedOption) =>
                handleQuestionTypeChange(index, selectedOption)
              }
              placeholder="Select Question Type"
            />

            <input
              className="col-2 py-1 rounded border border-dark"
              type="number"
              placeholder="Default Score"
              value={defaultScores[field.questionType?.value] || 1}
              onChange={(e) =>
                handleDefaultScoreChange(
                  field.questionType?.value,
                  e.target.value
                )
              }
            />
          </div>

          <div className="col-12 p-0">
            <div>QUESTION NO. {fieldQuestionNumbers[index]}</div>
          </div>
          <div className="row px-2">
            <input
              id={`question-${index}`}
              className="col-11 border border-dark rounded py-1 px-3 mb-1 "
              type="text"
              placeholder="Question"
              value={field.question}
              onChange={(e) =>
                handleFieldChange(index, {
                  ...field,
                  question: e.target.value,
                })
              }
            />
            <input
              className="col-1 border border-dark rounded py-1 px-3 mb-1"
              type="number"
              disabled = {scoreDifference == 0}
              placeholder="Score per question"
              value={field.score}
              onChange={(e) =>
                handleQuestionScoreChange(index, undefined, e.target.value)
              }
            />
          </div>

          {field.questionType && field.questionType.value === "TrueFalse" ? (
            <div className="px-3">
              {field.TFOptions.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label>
                    <input
                      type="radio"
                      value={option.label}
                      checked={field.answer === option.label}
                      onChange={(e) =>
                        handleFieldChange(index, {
                          ...field,
                          answer: e.target.value,
                        })
                      }
                    />
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          ) : field.questionType &&
            field.questionType.value === "MultipleChoice" ? (
            <div className="px-3">
              {field.MCOptions.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-1">
                  <label className="col-1">
                    <input
                      type="radio"
                      value={option.label}
                      checked={field.answer === option.label}
                      onChange={(e) =>
                        handleFieldChange(index, {
                          ...field,
                          answer: e.target.value,
                        })
                      }
                    />
                    {option.label}
                  </label>
                  <input
                    id={`mc-option-${index}-${optionIndex}`}
                    className="col-7 border border-dark rounded py-1 px-3"
                    type="text"
                    placeholder="Enter text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionTextChange(index, optionIndex, e.target.value)
                    }
                  />
                </div>
              ))}

              <div className="d-flex gap-2 mb-1">
                <button
                  onClick={() => addRadioOption(index)}
                  className="btn btn-outline-dark btn-sm"
                >
                  + Option
                </button>
                <button
                  onClick={() => subtractRadioOption(index)}
                  className="btn btn-outline-dark btn-sm"
                >
                  - Option
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2">
              <input
                id={`answer-${index}`}
                className="col-12 border border-dark rounded mb-1 py-1 px-3"
                type="text"
                placeholder="Answer"
                value={field.answer}
                onChange={(e) =>
                  handleFieldChange(index, {
                    ...field,
                    answer: e.target.value,
                  })
                }
              />
            </div>
          )}
          <div className="d-flex gap-1 px-3">
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => handleReset(index)}
            >
              <i className="bi bi-arrow-repeat"></i>
            </button>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => handleCopyFieldData(index)}
              disabled={scoreDifference <= 0}
            >
              Copy
            </button>
          </div>

          {/* for copyfield as sub field */}

          {field.copiedFields.length > 0 && (
            <div className="p-0 row justify-content-center">
              {field.copiedFields.map((copiedField, copiedIndex) => (
                <div
                  className="p-0 px-2 col-12 m-0 "
                  key={copiedIndex}
                  style={{ marginBottom: "10px" }}
                >
                  <div>
                    QUESTION NO. {fieldQuestionNumbers[index] + copiedIndex + 1}
                  </div>

                  <div className="p-0 mb-1">
                    <input
                      id={`copied-question-${index}-${copiedIndex}`}
                      className="col-11 border border-dark rounded px-3 py-1"
                      type="text"
                      placeholder="Question"
                      value={copiedField.question}
                      onChange={(e) =>
                        handleFieldChange(index, {
                          ...field,
                          copiedFields: field.copiedFields.map((cf, cIndex) =>
                            cIndex === copiedIndex
                              ? { ...cf, question: e.target.value }
                              : cf
                          ),
                        })
                      }
                    />
                    <input
                      className="col-1 border border-dark rounded py-1 px-3 mb-1"
                      type="number"
                      disabled = {scoreDifference == 0}
                      placeholder="Score per question"
                      value={copiedField.score}
                      onChange={(e) =>
                        handleQuestionScoreChange(
                          index,
                          copiedIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {field.questionType &&
                  field.questionType.value === "TrueFalse" ? (
                    <div className="px-2">
                      {field.TFOptions.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <label>
                            <input
                              type="radio"
                              value={option.label}
                              checked={copiedField.answer === option.label}
                              onChange={(e) =>
                                handleFieldChange(index, {
                                  ...field,
                                  copiedFields: field.copiedFields.map(
                                    (cf, cIndex) =>
                                      cIndex === copiedIndex
                                        ? { ...cf, answer: e.target.value }
                                        : cf
                                  ),
                                })
                              }
                            />
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : field.questionType &&
                    field.questionType.value === "MultipleChoice" ? (
                    <div className="px-2">
                      {copiedField.MCOptions.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <label className="col-1">
                            <input
                              type="radio"
                              value={option.label}
                              checked={copiedField.answer === option.label}
                              onChange={(e) =>
                                handleFieldChange(index, {
                                  ...field,
                                  copiedFields: field.copiedFields.map(
                                    (cf, cIndex) =>
                                      cIndex === copiedIndex
                                        ? { ...cf, answer: e.target.value }
                                        : cf
                                  ),
                                })
                              }
                            />
                            {option.label}
                          </label>
                          <input
                            id={`copied-mc-option-${index}-${copiedIndex}-${optionIndex}`}
                            className="col-7 py-1 px-3 border border-dark rounded mb-1"
                            type="text"
                            placeholder="Enter text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionTextChangeForCopiedField(
                                index,
                                copiedIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                      <div className="d-flex gap-2 mb-1">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => addRadioOption(index, copiedIndex)}
                        >
                          + Option
                        </button>
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            subtractRadioOption(index, copiedIndex)
                          }
                        >
                          - Option
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        id={`copied-answer-${index}-${copiedIndex}`}
                        className="border border-dark rounded col-12 px-3 py-1 mb-1"
                        type="text"
                        placeholder="Answer"
                        value={copiedField.answer}
                        onChange={(e) =>
                          handleFieldChange(index, {
                            ...field,
                            copiedFields: field.copiedFields.map((cf, cIndex) =>
                              cIndex === copiedIndex
                                ? { ...cf, answer: e.target.value }
                                : cf
                            ),
                          })
                        }
                      />
                    </div>
                  )}
                  <div className="d-flex gap-2 px-2">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => handleReset(index, copiedIndex)}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </button>

                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        handleRemoveCopiedField(index, copiedIndex)
                      }
                    >
                      <span className="p-2">-</span>
                    </button>

                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => handleCopyFieldData(index, copiedIndex)}
                      disabled={scoreDifference <= 0}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="d-flex justify-content-center mb-1 mt-1 gap-1">
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => handleCopyField(index, field.copiedFields.length)}
              disabled={scoreDifference <= 0}
            >
              Add Question
            </button>

            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => handleRemoveField(index)}
            >
              Remove Test {fieldTitleNumbers[index]}
            </button>
          </div>
        </fieldset>
      ))}
      <div>
        <p className="m-1 fw-bold">Remaining Score: {scoreDifference}</p>
      </div>
      {errorMessage && <p className="text-success">{errorMessage}</p>}
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-dark"
          onClick={addNewField}
          disabled={scoreDifference <= 0}
        >
          Add New Type
        </button>
        <button
          className="btn btn-outline-dark"
          onClick={handleSave}
          disabled={
            isSaveButtonDisabled ||
            scoreDifference !== 0 ||
            fields.some((f) => !f.question || !f.answer)
          }
        >
          Save All
        </button>
      </div>
    </div>
  );
};

export default QA;
