import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function Premade({setBack}) {
  const { TUPCID } = useTUPCID();
  const searchparams = useSearchParams();
  const testname = searchparams.get("testname");
  const sectionname = searchparams.get("sectionname");
  const uid = searchparams.get("uid");
  const subject = searchparams.get("subject");
  const semester = searchparams.get("semester");
  const [dragging, setDragging] = useState(false);
  const [datas, setDatas] = useState([]);
  const [questionType1, setQuestionType1] = useState([]);
  const [questionType2, setQuestionType2] = useState([]);
  const [firstQuestionTypeLabel, setFirstQuestionTypeLabel] = useState("");
  const [firstQuestionTypeLabel2, setFirstQuestionTypeLabel2] = useState("");
  const [success, setSuccess] = useState(false);
  const [wordGenerate, setWord] = useState(false);
  const [pdfGenerate, setPdf] = useState(false);

  //Local Storage key for the Questions
  const localKey1 = `PremadeTest1_${TUPCID}_${sectionname}_${uid}`;
  const localKey2 = `PremadeTest2_${TUPCID}_${sectionname}_${uid}`;

  //Changing Format of the Question
  const TransformQuestion = (questions, type) => {
    return questions.map((item, index) => {
      if (item.QuestionType === "MultipleChoice") {
        const options = [
          { label: "A", text: item.Option1 },
          { label: "B", text: item.Option2 },
          { label: "C", text: item.Option3 },
          { label: "D", text: item.Option4 },
        ];
        return {
          type: type,
          questionType: item.QuestionType,
          questionNumber: index + 1,
          question: item.Question,
          score: parseInt(item.Score, 10) > 10 ? 10 : parseInt(item.Score, 10),
          answer: item.Answer,
          options: options,
        };
      } else {
        return {
          type: type,
          questionType: item.QuestionType,
          questionNumber: index + 1,
          question: item.Question,
          score: parseInt(item.Score, 10) > 10 ? 10 : parseInt(item.Score, 10),
          answer: item.Answer.toUpperCase(),
        };
      }
    });
  };

  //Saving and Updating Testpaper
  const handleSave = async () => {
    const question1 = await TransformQuestion(questionType1, "TYPE 1");
    const question2 = await TransformQuestion(questionType2, "TYPE 2");
    const totalScore = [...question1, ...question2].reduce(
      (acc, curr) => acc + curr.score,
      0
    );
    try {
      const response = await axios.post(
        "http://localhost:3001/createtestpaper",
        {
          TUPCID: TUPCID,
          UID: uid,
          test_name: testname,
          section_name: sectionname,
          subject: subject,
          semester: semester,
          data: [...question1, ...question2, { TotalScore: totalScore }],
        }
      );
      if (response.status === 200) {
        setSuccess(true);
        localStorage.setItem(localKey1, JSON.stringify(questionType1));
        localStorage.setItem(localKey2, JSON.stringify(questionType2));
        try {
          await axios.post("http://localhost:3001/addtopreset", {
            Professor_ID: TUPCID,
            TESTNAME: testname,
            UID: uid,
            data: [...question1, ...question2, { TotalScore: totalScore }],
          });
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const resetStates = () => {
    setDatas([]);
    setQuestionType1([]);
    setQuestionType2([]);
    setFirstQuestionTypeLabel("");
    setFirstQuestionTypeLabel2("");
  };

const calculateTotalScore = (questionType) => {
    return questionType?.reduce((total, item) => {
      const score = parseInt(item.Score, 10);
      if (!isNaN(score) && score >= 1) {
        return total + (score > 10 ? 10 : score);
      }
      return total;
    }, 0);
  };
  
  const totalScoreType1 = calculateTotalScore(questionType1);
  const totalScoreType2 = calculateTotalScore(questionType2);
  const totalscore = totalScoreType1 + totalScoreType2;

  //Function For Drag Drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files[0]; // Get the dropped file

    if (file) {
      readExcel(file); // Call the readExcel function passing the dropped file
    }
  };
  const handleFileselect = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      readExcel(file);
    }
  };

  //Downloading or Generating Testpaper
  const generateTestPaperdoc = async () => {
    if (!wordGenerate && !pdfGenerate) {
      alert(
        "Please check at least one option (Word or PDF) before downloading the file."
      );
    } else {
      if (wordGenerate) {
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

      if (pdfGenerate) {
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

  // Function to read Excel file
  const readExcel = (file) => {
    resetStates();
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length <= 40) {
        const processedData = jsonData.map((item) => {
          const score = parseInt(item.Score, 10); // Parse score as integer
          return {
            ...item,
            Score: score > 10 ? 10 : score,
          };
        });
        setDatas(processedData);

        const questionTypes = {};

        jsonData.forEach((item) => {
          const questionType = item.QuestionType;
          if (!questionTypes[questionType]) {
            questionTypes[questionType] = [];
          }
          questionTypes[questionType].push(item);
        });

        Object.keys(questionTypes).forEach((type, index) => {
          if (index === 0) {
            setQuestionType1(questionTypes[type]);
          } else if (index === 1) {
            setQuestionType2(questionTypes[type]);
          }
        });
        console.log("data: ", datas);
      } else {
        alert(
          "The file contains more than 40 questions. Please upload a smaller file."
        );
      }
    };

    fileReader.readAsArrayBuffer(file);
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

  useEffect(() => {
    if (questionType1?.length > 0 && firstQuestionTypeLabel === "") {
      const firstQuestionType = questionType1[0]?.QuestionType || "";
      setFirstQuestionTypeLabel(`Question Type 1: ${firstQuestionType}`);
    }
    if (questionType2?.length > 0 && firstQuestionTypeLabel2 === "") {
      const secondQuestionType = questionType2[0]?.QuestionType || "";
      setFirstQuestionTypeLabel2(`Question Type 2: ${secondQuestionType}`);
    }
  }, [
    questionType1,
    questionType2,
    firstQuestionTypeLabel,
    firstQuestionTypeLabel2,
  ]);

  useEffect(() => {
    setQuestionType1(JSON.parse(localStorage.getItem(localKey1)));
    setQuestionType2(JSON.parse(localStorage.getItem(localKey2)));
  }, []);
  return (
    <main className="position-relative min-vh-100 p-2 w-100 d-flex justify-content-center align-items-center position-relative">
      <section className="row align-items-center justify-content-center">
        {!questionType1?.length > 0 ? (
          <div className="text-center">
            <a
              className="btn btn-outline-dark"
              download
              href="/Sample Format.xlsx"
            >
              Sample Format
            </a>
            <p className="">
              NOTE: <br />
              <span className="text-danger">
                * For Question Type only put TrueFalse, MultipleChoice, and
                Identification.
                <br />
                * Only 2 type combination of Question will be accepted. <br />
                * The maximum Question per type is 20 <br />
                * Option1 to Option4 is A to D <br />
                * Maximum score per question is 10 <br />* Only in
                MultipleChoice the Options
              </span>
            </p>
          </div>
        ) : (
          <></>
        )}
        <div
          className={`border rounded p-5 text-center ${
            questionType1?.length > 0 ? "col-4" : "col-12"
          } ${dragging ? "bg-secondary text-secondary" : "bg-light"}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div>
            <p>Drop your Excel file here or</p>
            <label htmlFor="fileInput" className="btn btn-primary">
              Select a file
              <input
                type="file"
                id="fileInput"
                accept=".xlsx, .xls"
                className="d-none"
                onChange={handleFileselect}
              />
            </label>
          </div>
        </div>
        {questionType1?.length > 0 || questionType2?.length > 0 ? (
          <h3 className="text-center p-0 fw-bold">
            TOTAL POINTS: {totalscore}
          </h3>
        ) : (
          <></>
        )}
        <div className="row col-xl-7 col-lg-9 col-12 justify-content-center">
          {questionType1?.length > 0 ? (
            <div className={questionType2.length > 0 ? "col-6" : `col-12`}>
              <h3>{firstQuestionTypeLabel}</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {questionType1?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {index + 1}. {item.Question}
                      </td>
                      <td>{item.Answer}</td>
                      <td>
                        {parseInt(item.Score, 10) > 10
                          ? 10
                          : parseInt(item.Score, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
          {questionType2?.length > 0 ? (
            <div className="col-6">
              <h3>{firstQuestionTypeLabel2}</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {questionType2?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {index + 1}. {item.Question}
                      </td>
                      <td>{item.Answer}</td>
                      <td>
                        {parseInt(item.Score, 10) > 10
                          ? 10
                          : parseInt(item.Score, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </div>
        {questionType1?.length > 0 || questionType2?.length > 0 ? (
          <div className="col-12 text-center">
            <button onClick={handleSave} className="btn btn-outline-dark mb-2">
              SAVE
            </button>
          </div>
        ) : (
          <></>
        )}
      </section>
      <button className="position-absolute top-0 start-0 btn btn-outline-dark" onClick={setBack}>
        Change Type
      </button>
      {success ? (
        <div className="d-block modal bg-opacity-50 bg-dark m-0" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-success">
              <div className="modal-header">
                <h5 className="modal-title">Successful</h5>
              </div>
              <div className="modal-body text-center">
                <p>Successfully Saved!</p>
              </div>
              <div className="modal-footer">
                <div className="text-center w-100">
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn btn-outline-dark"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="position-fixed end-0 bottom-0 p-3 d-flex flex-column gap-3">
        <div className="card align-items-end">
          <div className="card-body">
            <p onClick={() => console.log(mounted)}>Generate:</p>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="generateWord"
                onChange={() => setWord(!wordGenerate)}
              />
              <label className="form-check-label" htmlFor="generateWord">
                Docx
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="generatePDF"
                onChange={() => setPdf(!pdfGenerate)}
              />
              <label className="form-check-label" htmlFor="generatePDF">
                PDF
              </label>
            </div>
            <button
              className="btn btn-outline-dark mt-3"
              onClick={generateTestPaperdoc}
            >
              Download
            </button>
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-dark btn-lg" onClick={openPresetPage}>
            Test Bank
          </button>
        </div>
      </div>
    </main>
  );
}

export default Premade;
