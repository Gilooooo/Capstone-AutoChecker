"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Records() {
  const { TUPCID } = useTUPCID();
  const searchparams = useSearchParams();
  const testname = searchparams.get("testname");
  const sectionname = searchparams.get("sectionname");
  const uid = searchparams.get("uid");
  const semester = searchparams.get("semester");
  const [totalscore, settotatlscore] = useState([]);
  const [recordlist, setRecordList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedRecords, setUpdatedRecords] = useState([]);
  const [warning, setWarning] = useState(false);
  const [questions, setQuestions] = useState(0);
  const [barChartData, setBarChartData] = useState({});

  const fetchResult = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/Studentscores/${uid}`
      );

      if (response.status === 200) {
        const { studentlist, numQuestions } = response.data;
        const sortedRecords = [...studentlist];
        sortedRecords.sort((a, b) => b.TOTALSCORE - a.TOTALSCORE);
        setRecordList(sortedRecords);
        setQuestions(numQuestions);

        // Prepare data for bar chart with rankings
        const scores = sortedRecords.map((record, index) => ({
          rank: index + 1,
          score: record.TOTALSCORE,
        }));
        const barData = {
          labels: scores.map((student) => `Rank ${student.rank}`),
          datasets: [
            {
              label: "Student Scores",
              backgroundColor: "rgba(75,192,192,1)",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 1,
              data: scores.map((student) => student.score),
            },
          ],
        };
        setBarChartData(barData);
        console.log("bardata...", barData);
      } else {
        console.error("Failed to fetch student scores");
      }
    } catch (error) {
      console.error("Error fetching student scores:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchResult();
    }
  }, [uid]);

  const generateSheet = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/printstudentrecord/${uid}`,
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute("download", "student_records.xlsx");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log(
          "Excel file generation initiated from backend for UID:",
          uid
        );
      } else {
        console.error("Failed to initiate Excel file generation from backend");
      }
    } catch (error) {
      console.error("Error while initiating Excel file generation:", error);
    }
  };

  const formattedData = recordlist.map((record, index) => ({
    label: `${record.SURNAME}, ${record.FIRSTNAME}`,
    score: record.TOTALSCORE,
  }));

  return (
    <main className="min-vh-100 p-2 w-100">
      <section className="h-50">
        {/* Header and Navigation */}
        <div className="d-flex align-items-center">
          <Link href="/Faculty/ListOfTest">
            <i className="bi bi-arrow-left fs-3 custom-black-color "></i>
          </Link>
          <h3 className="m-0">
            {sectionname}: {semester} - {testname} UID: {uid}
          </h3>
        </div>

        {/* Navigation */}
        <ul className="d-flex flex-wrap justify-content-around mt-3 list-unstyled">
          <Link
            href={{
              pathname: "/Faculty/Test/Question_Answer",
              query: {
                testname: testname,
                uid: uid,
                sectionname: sectionname,
                semester: semester,
              },
            }}
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">TESTPAPER</li>
          </Link>

          <Link
            href={{
              pathname: "/Faculty/Test/AnswerSheet",
              query: {
                testname: testname,
                uid: uid,
                sectionname: sectionname,
                semester: semester,
              },
            }}
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">ANSWER SHEET</li>
          </Link>
          <Link
            href={{
              pathname: "/Faculty/Test/AnswerKey",
              query: {
                testname: testname,
                uid: uid,
                sectionname: sectionname,
                semester: semester,
              },
            }}
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">ANSWER KEY</li>
          </Link>

          <li className="m-0 fs-5 text-decoration-underline">RECORDS</li>
        </ul>

        {/* Content */}
        <section className="container col-md-8 col-12 col-xl-6 mt-4 py-4 col-10 px-3 border border-dark rounded h-100">
          <div className="border border-dark rounded h-100 overflow-auto">
            {/* Table for Student Records */}
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>STUDENT NAME</th>
                  <th>NUMBER OF CORRECT</th>
                  <th>NUMBER OF WRONG</th>
                  <th>TOTAL NUMBER OF QUESTIONS</th>
                  <th>TOTAL SCORE</th>
                </tr>
              </thead>
              <tbody>
                {recordlist.map((record, index) => (
                  <tr key={index}>
                    <td>{record.TUPCID}</td>
                    <td>
                      {record.SURNAME}, {record.FIRSTNAME}{" "}
                    </td>
                    <td>{record.CORRECT}</td>
                    <td>{questions - parseInt(record.CORRECT)}</td>
                    <td>{questions}</td>
                    <td>{`${record.TOTALSCORE} / ${record.MAXSCORE}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {barChartData.labels && barChartData.labels.length > 0 && (
          <section className="container mt-4 py-4 col-10 px-3 border border-dark rounded h-70">
            <h4 className="text-center">STUDENT TEST RESULT</h4>
            <div className="border border-dark rounded p-3">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="rgba(75,192,192,1)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
        <div className="text-center mt-3">
          <button onClick={generateSheet} className="btn btn-outline-dark">
            GENERATE SHEET
          </button>
        </div>
        {/* End Content */}
        {/* Modal */}
        {warning && (
          <div className="d-block modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border border-dark">
                <div className="modal-header">
                  <h5 className="modal-title">Warning</h5>
                </div>
                <div className="modal-body">
                  <p className="text-center">
                    Sum of correct and wrong answers does not match MAXSCORE.
                    Cannot update.
                  </p>
                </div>
                <div className="modal-footer align-self-center">
                  <button
                    type="button"
                    className="btn btn-dark"
                    data-bs-dismiss="modal"
                    onClick={() => setWarning(!warning)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
      </section>
    </main>
  );
}
