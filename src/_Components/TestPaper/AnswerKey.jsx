"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useTUPCID } from "@/app/Provider";
import Link from "next/link";
import TextLocalization1 from "./camera/textLocalization1";
import ImageInput1 from "@/app/Faculty/Test/upload1/page";
import ImageInput2 from "@/app/Faculty/Test/upload2/page";

export default function AnswerKey() {
  const { TUPCID } = useTUPCID();
  const searchparams = useSearchParams();
  const testname = searchparams.get("testname");
  const sectionname = searchparams.get("sectionname");
  const uid = searchparams.get("uid");
  const subject = searchparams.get("subject");
  const semester = searchparams.get("semester");
  const [testData, setTestData] = useState([]);
  const [testType, setTestType] = useState("No Test Paper Yet");
  const [api, setApi] = useState("");
  const [ImageData1, setImageData1] = useState(null);
  const [ImageData2, setImageData2] = useState(null);
  const [ImageData3, setImageData3] = useState(null);
  const [totalScoreValue, setTotalScoreValue] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalScore2, setTotalScore2] = useState(0);
  const [Wrong, setWrong] = useState(0);
  const [Correct, setCorrect] = useState(0);
  const [studentid, setstudentid] = useState([]);
  const [uidget, setuidget] = useState([]);
  const [testType2, setTestType2] = useState([]);

  const handleImageSelected1 = (retrievedImages) => {
    setImageData1(retrievedImages);
  };

  const handleImageSelected2 = (retrievedImages) => {
    setImageData2(retrievedImages);
  };

  const handleImageSelected3 = (retrievedImages) => {
    setImageData3(retrievedImages);
  };

  const [MultipleChoice, setMultipleChoice] = useState(null);
  const [MultipleChoicearray1, setMultipleChoicearray1] = useState([]);
  const [MultipleChoicearray2, setMultipleChoicearray2] = useState([]);

  const [TrueFalse, setTrueFalse] = useState(null);
  const [TrueFalsearray1, setTrueFalsearray1] = useState([]);
  const [TrueFalsearray2, setTrueFalsearray2] = useState([]);

  const [Identification, setIdentification] = useState(null);
  const [Identificationarray1, setIdentificationarray1] = useState([]);
  const [Identificationarray2, setIdentificationarray2] = useState([]);

  const extractedStudentId = (textArray) => {
    let studentId = "";
    for (let i = 0; i < textArray.length; i++) {
      if (textArray[i].includes("TUPCID:")) {
        const parts = textArray[i].split(":");
        if (parts.length === 2) {
          studentId = parts[1].trim();
          break;
        }
      }
    }
    return studentId;
  };

  const extracteduid = (textArray) => {
    let uidget = "";
    for (let i = 0; i < textArray.length; i++) {
      if (textArray[i].includes("UID:")) {
        const parts = textArray[i].split(":");
        if (parts.length === 2) {
          uidget = parts[1].trim();
          break;
        }
      }
    }
    return uidget;
  };

  const fetchingApi = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Getting2");
      if (response.status === 200) {
        setApi(response.data[0].Secret);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMultipleChoice = (data) => {
    setMultipleChoice(data);
    const allTextArray = data;
    const studentId = extractedStudentId(allTextArray);
    const UIDpaper = extracteduid(allTextArray);

    setMultipleChoicearray1(allTextArray.slice(0, 4));
    const updatedArray2 = allTextArray.slice(4).map((line) => {
      const lastLetter = line.charAt(line.length - 1);
      return lastLetter;
    });
    setMultipleChoicearray2(updatedArray2);
    setuidget(UIDpaper);
    setstudentid(studentId);
    setTestType2((prevTypes) =>
      prevTypes.includes("MULTIPLE CHOICE")
        ? prevTypes
        : [...prevTypes, "MULTIPLE CHOICE"]
    );
  };

  const handleTrueFalse = (data) => {
    setTrueFalse(data);
    const allTextArray = data;
    const studentId = extractedStudentId(allTextArray);
    const UIDpaper = extracteduid(allTextArray);

    setTrueFalsearray1(allTextArray.slice(0, 4));

    const updatedArray2 = allTextArray.slice(4).map((line) => {
      const lastLetter = line.charAt(line.length - 1);
      return lastLetter;
    });
    setTrueFalsearray2(updatedArray2);
    setuidget(UIDpaper);
    setstudentid(studentId);
    setTestType2((prevTypes) =>
      prevTypes.includes("TRUE OR FALSE")
        ? prevTypes
        : [...prevTypes, "TRUE OR FALSE"]
    );
  };

  const handleIdentification = (data) => {
    setIdentification(data);
    const allTextArray = data;
    const studentId = extractedStudentId(allTextArray);
    const UIDpaper = extracteduid(allTextArray);

    setIdentificationarray1(allTextArray.slice(0, 4));

    const updatedArray2 = allTextArray
      .slice(4)
      .map((line) => line.replace(/ /g, ""));
    setIdentificationarray2(updatedArray2);
    setuidget(UIDpaper);
    setstudentid(studentId);
    setTestType2((prevTypes) =>
      prevTypes.includes("IDENTIFICATION")
        ? prevTypes
        : [...prevTypes, "IDENTIFICATION"]
    );
  };

  useEffect(() => {
    setTotalScore(totalScoreValue);
  }, [totalScoreValue]);

  const [dataResult, setDataResult] = useState([]);
  const [allAnswerArrays, setAllAnswerArrays] = useState([]);

  useEffect(() => {
    // Create an array of arrays, each containing non-empty trimmed lines
    const combinedArray = [
      MultipleChoicearray2.filter((line) => line.trim() !== ""),
      TrueFalsearray2.filter((line) => line.trim() !== ""),
      Identificationarray2.filter((line) => line.trim() !== ""),
    ];

    // Update the state with the combined array
    setAllAnswerArrays(combinedArray);
  }, [MultipleChoicearray2, TrueFalsearray2, Identificationarray2]);

  useEffect(() => {}, [
    studentid,
    uidget,
    testType2,
    Wrong,
    Correct,
    totalScore2,
    totalScoreValue,
    allAnswerArrays,
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [students, setStudents] = useState({});

  const toRoman = (num) => {
    const romanNumerals = ["I", "II"];
    return romanNumerals[num] || num;
  };

  const fetchQuestionData = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/getquestionstypeandnumberandanswer?uid=${uid}`
      );
      if (response.status === 200) {
        const {
          questionNumbers,
          questionTypes,
          answers,
          score,
          totalScoreValue,
        } = response.data;

        const organizedData = questionTypes.reduce((acc, type, index) => {
          if (type && answers[index]) {
            const questionNumber = questionNumbers[index];
            const answer = answers[index];
            const questionScore = score[index];

            if (!acc[type]) {
              acc[type] = {
                questions: [],
                score: 0,
                TotalScore: 0,
              };
            }

            acc[type].questions.push({
              questionNumber,
              answer,
              score: questionScore,
            });
            acc[type].score += questionScore || 0;
          }
          return acc;
        }, {});

        const organizedDataArray = Object.entries(organizedData).map(
          ([type, data]) => ({
            type,
            questions: data.questions,
            score: data.score,
          })
        );

        setTestData(organizedDataArray);
        setTotalScoreValue(totalScoreValue);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchQuestionData();
    fetchingApi();
  }, []);

  useEffect(() => {
    const calculateTotalScore = () => {
      let totalScore = 0;
      let scorePointsArray = [];
      let numberOfCorrect = 0;
      let numberOfWrong = 0;

      testData.forEach((testSection, testIndex) => {
        if (testSection.type === "MultipleChoice" && MultipleChoice) {
          // Handling MultipleChoice type
          testSection.questions.forEach((question, questionIndex) => {
            const studentAnswer = MultipleChoicearray2.filter(
              (line) => line.trim() !== ""
            )[questionIndex];
            const matchingQuestion = testSection.questions[questionIndex];

            if (studentAnswer && matchingQuestion && matchingQuestion.answer) {
              const isCorrect = studentAnswer
                .trim()
                .toUpperCase()
                .includes(matchingQuestion.answer.trim().toUpperCase());
              const scorePoints = isCorrect
                ? parseInt(matchingQuestion.score)
                : 0;

              totalScore += scorePoints;
              scorePointsArray.push(scorePoints);

              if (isCorrect) {
                numberOfCorrect++;
              } else {
                numberOfWrong++;
              }
            } else {
              scorePointsArray.push(0);
              numberOfWrong++;
            }
          });
        } else if (testSection.type === "Identification" && Identification) {
          // Handling Identification type
          testSection.questions.forEach((question, questionIndex) => {
            const studentAnswer = Identificationarray2.filter(
              (line) => line.trim() !== ""
            )[questionIndex];
            const matchingQuestion = testSection.questions[questionIndex];

            if (studentAnswer && matchingQuestion && matchingQuestion.answer) {
              const isCorrect = studentAnswer
                .trim()
                .toUpperCase()
                .includes(matchingQuestion.answer.trim().toUpperCase());
              const scorePoints = isCorrect
                ? parseInt(matchingQuestion.score)
                : 0;

              totalScore += scorePoints;
              scorePointsArray.push(scorePoints);

              if (isCorrect) {
                numberOfCorrect++;
              } else {
                numberOfWrong++;
              }
            } else {
              scorePointsArray.push(0);
              numberOfWrong++;
            }
          });
        } else if (testSection.type === "TrueFalse" && TrueFalse) {
          // Handling TrueFalse type
          testSection.questions.forEach((question, questionIndex) => {
            const studentAnswer = TrueFalsearray2.filter(
              (line) => line.trim() !== ""
            )[questionIndex];
            const matchingQuestion = testSection.questions[questionIndex];

            if (studentAnswer && matchingQuestion && matchingQuestion.answer) {
              const isCorrect = studentAnswer
                .trim()
                .toUpperCase()
                .includes(matchingQuestion.answer.trim().toUpperCase());
              const scorePoints = isCorrect
                ? parseInt(matchingQuestion.score)
                : 0;

              totalScore += scorePoints;
              scorePointsArray.push(scorePoints);

              if (isCorrect) {
                numberOfCorrect++;
              } else {
                numberOfWrong++;
              }
            } else {
              // If the student's answer or the correct answer is not available, or it's incorrect, push 0
              scorePointsArray.push(0);
              numberOfWrong++;
            }
          });
        }
      });

      setTotalScore2(totalScore);
      // Assuming you have state variables to store the number of correct and wrong answers
      setCorrect(numberOfCorrect);
      setWrong(numberOfWrong);
      console.log("check testtype: ", testType2);
    };

    calculateTotalScore();
  }, [
    testData,
    MultipleChoicearray2,
    MultipleChoice,
    TrueFalse,
    Identification,
    Identificationarray2,
    TrueFalsearray2,
  ]);

  const fetchStudentname = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/Studentname/${studentid}`
      );
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (studentid) {
      fetchStudentname();
    }
  }, [studentid]);

  const sendresult = async () => {
    const transformedTypes = testType2.map((type) => {
      switch (type) {
        case "MULTIPLE CHOICE":
          return "MultipleChoice";
        case "TRUE OR FALSE":
          return "TrueFalse";
        case "IDENTIFICATION":
          return "Identification";
        default:
          return type;
      }
    });

    if (uid !== uidget) {
      alert("UID and UID in paper do not match. Data will not be sent.");
      return;
    }

    // Filter out empty arrays from allAnswerArrays
    const nonEmptyAnswers = allAnswerArrays.filter(
      (answerArray) => answerArray.length > 0
    );

    const data = {
      studentid: studentid,
      uid: uid,
      testtype2: transformedTypes,
      result: nonEmptyAnswers,
      correct: Correct,
      wrong: Wrong,
      totalscore: totalScore2,
      maxscore: totalScoreValue,
    };

    try {
      const response = await axios.post(
        "https://capstone-server-production-ddc7.up.railway.app/sendresult",
        data
      );
      if (response.status === 200) {
        alert("SEND DATA SUCCESSFULLY"); // Data added to the test successfully
      } else {
        throw new Error("Failed to add data to the test");
      }
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };

  return (
    <main className="min-vh-100 w-100 p-2">
      <section>
        <div className="d-flex align-items-center">
          <Link href="/Faculty/ListOfTest">
            <i className="bi bi-arrow-left fs-3 custom-black-color "></i>
          </Link>

          <h3 className="m-0">
            {sectionname}: {subject} - {semester}: {testname} UID: {uid}
          </h3>
        </div>
        <ul className="d-flex flex-wrap justify-content-around mt-3 list-unstyled">
          <Link
            href={{
              pathname: "/Faculty/Test/Question_Answer",
              query: {
                testname: testname,
                uid: uid,
                sectionname: sectionname,
                semester: semester,
                subject: subject,
              },
            }}
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">TEST PAPER</li>
          </Link>
          <Link
            href={{
              pathname: "/Faculty/Test/AnswerSheet",
              query: {
                testname: testname,
                uid: uid,
                sectionname: sectionname,
                semester: semester,
                subject: subject,
              },
            }}
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5 text-decoration-none">ANSWER SHEET</li>
          </Link>
          <li className="m-0 fs-5">ANSWER KEY</li>
          <Link
            href={{
              pathname: "/Faculty/Test/Records",
              query: {
                testname: testname,
                uid: uid,
                sectionname: sectionname,
                semester: semester,
                subject: subject,
              },
            }}
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">RECORDS</li>
          </Link>
        </ul>
        <section className="container-sm mt-5 col-xl-6 py-3 px-4 border border-dark rounded">
          <form className="row">
            <div className="col-6">
              <h5 className="m-0 text-center align-self-center">TEST</h5>
              <div className="col-12 mt-4">
                <p>Total Score: {totalScore} POINTS </p>
              </div>

              {testData.map((testSection, index) => (
                <div key={index}>
                  <h6 className="col-12 mt-4">{`TEST ${toRoman(index)}  ${
                    testSection.type
                  }`}</h6>
                  <ul className="col-6 list-unstyled">
                    {testSection.questions.map((question, qIndex) => (
                      <li key={qIndex}>
                        {`${question.questionNumber}. ${question.answer} `}
                      </li>
                    ))}
                    {index === 0 && (
                      <ImageInput1 onImageSelected={handleImageSelected1} />
                    )}
                    {index === 0 && ImageData1 && (
                      // Check the testSection type and set the appropriate setData function
                      <>
                        {testSection.type === "MultipleChoice" && (
                          <TextLocalization1
                            api={api}
                            imageData={ImageData1}
                            setData={handleMultipleChoice}
                          />
                        )}
                        {testSection.type === "TrueFalse" && (
                          <TextLocalization1
                            api={api}
                            imageData={ImageData1}
                            setData={handleTrueFalse}
                          />
                        )}
                        {testSection.type === "Identification" && (
                          <TextLocalization1
                            api={api}
                            imageData={ImageData1}
                            setData={handleIdentification}
                          />
                        )}
                      </>
                    )}

                    {index === 1 && (
                      <ImageInput2 onImageSelected={handleImageSelected2} />
                    )}
                    {index === 1 && ImageData2 && (
                      // Check the testSection type and set the appropriate setData function
                      <>
                        {testSection.type === "MultipleChoice" && (
                          <TextLocalization1
                            api={api}
                            imageData={ImageData2}
                            setData={handleMultipleChoice}
                          />
                        )}
                        {testSection.type === "TrueFalse" && (
                          <TextLocalization1
                            api={api}
                            imageData={ImageData2}
                            setData={handleTrueFalse}
                          />
                        )}
                        {testSection.type === "Identification" && (
                          <TextLocalization1
                            api={api}
                            imageData={ImageData2}
                            setData={handleIdentification}
                          />
                        )}
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>
            <div className="col-6">
              <h5 className="m-0 text-center align-self-center">
                STUDENT ID: {studentid}
              </h5>
              <h5 className="m-0 text-center align-self-center">
                UID: {uidget}
              </h5>

              <h5 className="m-0 text-center align-self-center">
                STUDENT ANSWER
              </h5>
              <p>
                Total Score: {totalScore2} / {totalScoreValue}{" "}
              </p>

              {testData.map((testSection, index, total) => (
                <div key={index}>
                  {index === 0 &&
                    testSection.type === "MultipleChoice" &&
                    MultipleChoice && (
                      <div>
                        <br />
                        <ol>
                          <h6>
                            TEST {toRoman(index)} {testSection.type}
                          </h6>
                          {MultipleChoicearray2.filter(
                            (line) => line.trim() !== ""
                          ).map((studentAnswer, index) => {
                            const matchingQuestion =
                              testSection.questions[index];

                            if (
                              studentAnswer &&
                              matchingQuestion &&
                              matchingQuestion.answer
                            ) {
                              const isCorrect = studentAnswer
                                .trim()
                                .includes(matchingQuestion.answer.trim());
                              const scorePoints = isCorrect
                                ? parseInt(matchingQuestion.score)
                                : 0;
                              const scoreText = isCorrect ? "check" : "wrong";

                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            }
                          })}
                        </ol>
                      </div>
                    )}

                  {index === 0 &&
                    testSection.type === "TrueFalse" &&
                    TrueFalse && (
                      <div>
                        <br />
                        <ol>
                          <h6>
                            TEST {toRoman(index)} {testSection.type}
                          </h6>
                          {TrueFalsearray2.filter(
                            (line) => line.trim() !== ""
                          ).map((studentAnswer, index) => {
                            const matchingQuestion =
                              testSection.questions[index]; // Get the corresponding question

                            // Check if both student's answer and correct answer are available
                            if (
                              studentAnswer &&
                              matchingQuestion &&
                              matchingQuestion.answer
                            ) {
                              const isCorrect = studentAnswer
                                .trim()
                                .includes(matchingQuestion.answer.trim());
                              // Check if correct answer is included in student's answer
                              const scorePoints = isCorrect
                                ? parseInt(matchingQuestion.score)
                                : 0;
                              const scoreText = isCorrect ? "check" : "wrong";

                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            }
                          })}
                        </ol>
                      </div>
                    )}
                  {index === 0 &&
                    testSection.type === "Identification" &&
                    Identification && (
                      <div>
                        <br />
                        <ol>
                          <h6>
                            TEST {toRoman(index)} {testSection.type}
                          </h6>
                          {Identificationarray2.filter(
                            (line) => line.trim() !== ""
                          ).map((studentAnswer, index) => {
                            const matchingQuestion =
                              testSection.questions[index];

                            if (
                              studentAnswer &&
                              matchingQuestion &&
                              matchingQuestion.answer
                            ) {
                              const isCorrect = studentAnswer
                                .trim()
                                .includes(matchingQuestion.answer.trim());
                              const scoreText = isCorrect ? "check" : "wrong";

                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            } else {
                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            }
                          })}
                        </ol>
                      </div>
                    )}

                  {index === 1 &&
                    testSection.type === "MultipleChoice" &&
                    MultipleChoice && (
                      <div>
                        <br />
                        <ol>
                          <h6>
                            TEST {toRoman(index)} {testSection.type}
                          </h6>
                          {MultipleChoicearray2.filter(
                            (line) => line.trim() !== ""
                          ).map((studentAnswer, index) => {
                            const matchingQuestion =
                              testSection.questions[index];

                            if (
                              studentAnswer &&
                              matchingQuestion &&
                              matchingQuestion.answer
                            ) {
                              const isCorrect = studentAnswer
                                .trim()
                                .includes(matchingQuestion.answer.trim());
                              const scoreText = isCorrect ? "check" : "wrong";

                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            }
                          })}
                        </ol>
                      </div>
                    )}

                  {index === 1 &&
                    testSection.type === "TrueFalse" &&
                    TrueFalse && (
                      <div>
                        <br />
                        <ol>
                          <h6>
                            TEST {toRoman(index)} {testSection.type}
                          </h6>
                          {TrueFalsearray2.filter(
                            (line) => line.trim() !== ""
                          ).map((studentAnswer, index) => {
                            const matchingQuestion =
                              testSection.questions[index]; // Get the corresponding question

                            // Check if both student's answer and correct answer are available
                            if (
                              studentAnswer &&
                              matchingQuestion &&
                              matchingQuestion.answer
                            ) {
                              const isCorrect = studentAnswer
                                .trim()
                                .includes(matchingQuestion.answer.trim()); // Check if correct answer is included in student's answer
                              const scoreText = isCorrect ? "check" : "wrong"; // Assign score text based on correctness

                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            }
                          })}
                        </ol>
                      </div>
                    )}

                  {index === 1 &&
                    testSection.type === "Identification" &&
                    Identification && (
                      <div>
                        <br />
                        <ol>
                          <h6>
                            TEST {toRoman(index)} {testSection.type}
                          </h6>
                          {Identificationarray2.filter(
                            (line) => line.trim() !== ""
                          ).map((studentAnswer, index) => {
                            const matchingQuestion =
                              testSection.questions[index]; // Get the corresponding question

                            // Check if both student's answer and correct answer are available
                            if (
                              studentAnswer &&
                              matchingQuestion &&
                              matchingQuestion.answer
                            ) {
                              const isCorrect = studentAnswer
                                .trim()
                                .includes(matchingQuestion.answer.trim()); // Check if correct answer is included in student's answer
                              const scoreText = isCorrect ? "check" : "wrong"; // Assign score text based on correctness

                              return (
                                <li key={index}>
                                  {studentAnswer} - {scoreText}
                                </li>
                              );
                            }
                          })}
                        </ol>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </form>
        </section>
      </section>
      <div className="position-fixed bottom-0 end-0 p-3">
        <button className="btn btn-dark btn-lg" onClick={sendresult}>
          SEND
        </button>
      </div>
    </main>
  );
}
