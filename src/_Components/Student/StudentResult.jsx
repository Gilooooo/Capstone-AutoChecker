"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { useTUPCID } from "@/app/Provider";
import axios from "axios";

function StudentResult({ clicked, setClicked }) {
  const searchparams = useSearchParams();
  const studentid = searchparams.get("studentid");
  const uid = searchparams.get("uidoftest");

  const [numberOfCorrect, setNumberOfCorrect] = useState(0);
  const [numberOfWrong, setNumberOfWrong] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [TUPCID, setTUPCID] = useState("");
  const [recordList, setRecordList] = useState([]);
  const [studentAnswerData, setStudentAnswerData] = useState([]);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    if (studentid) {
      fetchStudentname();
    }
  }, [studentid]);

  useEffect(() => {
    if (TUPCID && uid) {
      fetchResult();
    }
  }, [TUPCID, uid]);

  const fetchStudentname = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/Studentname2?studentid=${studentid}`
      );
      setTUPCID(response.data.TUPCID);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResult = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/myresult?TUPCID=${TUPCID}&uid=${uid}`
      );

      if (response.status === 200) {
        const { resultlist } = response.data;
        setRecordList(resultlist);
        const [result] = resultlist;
        if (result) {
          const { CORRECT, WRONG, TOTALSCORE, MAXSCORE } = result;

          setNumberOfCorrect(CORRECT || 0);
          setNumberOfWrong(WRONG || 0);
          setTotalScore(TOTALSCORE || 0);
          setMaxScore(MAXSCORE || 0);
        }
      } else {
        console.error("Failed to fetch student scores");
      }
    } catch (error) {
      console.error("Error fetching student scores:", error);
    }
  };

  const handleclick = () => {
    setClicked(!clicked);
  };
  const fetchQuestionData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getquestionstypeandnumberandanswer?uid=${uid}`
      );
      if (response.status === 200) {
        const { questionNumbers, questionTypes, answers, score } =
          response.data;

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
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchStudentAnswers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getstudentanswers?TUPCID=${TUPCID}&UID=${uid}`
      );
      if (response.status === 200) {
        const { studentAnswers } = response.data;
        const organizedDataArray2 = JSON.parse(studentAnswers.TESTTYPE).map(
          (type, typeIndex) => {
            // Check if results array is available for the current type
            if (studentAnswers.results && studentAnswers.results[typeIndex]) {
              return {
                type,
                answers: JSON.parse(studentAnswers.results)[typeIndex].map(
                  (answer, index) => ({
                    questionNumber: index,
                    answer,
                  })
                ),
              };
            }
            return {
              type,
              answers: [], // If no results are available, set answers to an empty array
            };
          }
        );

        setStudentAnswerData(organizedDataArray2);
      } else {
        console.error("Error fetching student answers");
      }
    } catch (error) {
      console.error("Error fetching student answers:", error);
    }
  };

  useEffect(() => {
    if (TUPCID && uid) {
      fetchStudentAnswers();
    }
  }, [TUPCID, uid]);

  useEffect(() => {
    if (uid) {
      fetchQuestionData();
    }
  }, [uid]);

  return (
    <main className="w-100 min-vh-100">
      <section className="container-fluid col-12 p-2 d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i
            className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
            onClick={handleclick}
          ></i>
          <Link href={{ pathname: "/Student" }}>
            <i className="bi bi-arrow-left fs-3 custom-black-color d-sm-block d-none"></i>
          </Link>
          <h2 className="m-0 w-100 text-sm-start text-center pe-3" onClick={() => console.log(studentAnswerData)}>
            SUMMARY OF YOUR TEST
          </h2>
        </div>
        <div className="col-sm-8 align-self-sm-center d-flex flex-column">
          <span>Number of Correct Answers: {numberOfCorrect}</span>
          <span>Number of Wrong Answers: {numberOfWrong}</span>
          <span>
            Total Score: {totalScore} / {maxScore}
          </span>
        </div>

        <div className="container border border-dark rounded d-flex flex-column col-sm-8 align-self-center align-items-center p-2 gap-2 table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr className="text-center">
                <th scope="col">Test Type</th>
                <th scope="col">Answer Key</th>
                <th scope="col">Student Answer</th>
              </tr>
            </thead>
            <tbody>
              {testData.map((testSection, index) => (
                <tr key={index}>
                  <td>{testSection.type}</td>
                  <td>
                    <ol>
                      {testSection.questions.map((question, qIndex) => (
                        <li key={qIndex}>{`${question.answer}`}</li>
                      ))}
                    </ol>
                  </td>
                  <td>
                    {studentAnswerData.map((answerSection, aIndex) => {
                      if (answerSection.type === testSection.type) {
                        return (
                          <div key={aIndex}>
                            <ol>
                              {answerSection.answers.map(
                                (answer, answerIndex) => (
                                  <li
                                    key={answerIndex}
                                  >{`${answer.answer}`}</li>
                                )
                              )}
                            </ol>
                          </div>
                        );
                      }
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default StudentResult;
