import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import { useEffect, useState } from "react";

const renderQuestions = (questionsData) => {
  if (!Array.isArray(questionsData)) {
    return null; // Handle the case where questionsData is not an array
  }

  const questionGroups = {};

  questionsData.forEach((questionData) => {
    const { type } = questionData;
    if (!questionGroups[type]) {
      questionGroups[type] = [];
    }
    questionGroups[type].push(questionData);
  });

  return Object.entries(questionGroups).map(([type, questionsOfType], index) => (
    <div key={index}>
      <h4>{`${type}`}</h4>
      {questionsOfType.map((question, qIndex) => (
        <div key={qIndex}>
          {question.questionType === 'MultipleChoice' ? (
            <p>{`${question.questionNumber}.QUESTION: ${question.question} |  ANSWER: ${question.options}`}</p>
          ) : (
            <p>{`${question.questionNumber}.QUESTION: ${question.question} |  ANSWER: ${question.answer}`}</p>
          )}
        </div>
      ))}
    </div>
  ));
};

function Preset({ setClicked, clicked }) {
  const { TUPCID } = useTUPCID();
  const [presetList, setPresetList] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const fetchingPresetTestList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/Preset?UidProf=${TUPCID}`
      );
      if (response.status === 200) {
        setPresetList(response.data);
      } else {
        alert("Problem");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestClick = async (test) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/PresetQuestions?TestId=${test.UID}`
      );
      if (response.status === 200) {
        setSelectedTest({
          ...test,
          questions: response.data,
        });
      } else {
        alert("Problem fetching questions");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const Oldest = () => {
    setSorted(true);
    const sortedpreset = [...presetList].sort(
      (a, b) => new Date(b.questions_saved) - new Date(a.questions_saved)
    );
    setPresetList(sortedpreset);
  };

  const Newest = () => {
    setSorted(true);
    const sortedpreset = [...presetList].sort(
      (a, b) => new Date(a.questions_saved) - new Date(b.questions_saved)
    );
    setPresetList(sortedpreset);
  };

  useEffect(() => {
    const fetching = setInterval(() => {
      if (sorted) {
        return;
      }
      fetchingPresetTestList();
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
  }, [TUPCID, sorted]);

  const handleclick = () => {
    setClicked(!clicked);
  };

  return (
    <main className="w-100 min-vh-100 d-flex justify-content-center">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-start p-2">
        <div className="d-flex align-items-center gap-3 w-100">
          <i
            className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
            onClick={handleclick}
          ></i>
          <div className="d-flex align-items-center gap-2 w-100">
            <h2 className="m-0 pe-3 w-100 text-sm-start text-center">
              FACULTY
            </h2>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 px-sm-2 mt-2">
          <h3>TEST BANK</h3>
          <div className="d-flex flex-column align-self-end">
            <small className="text-end">Sort by:</small>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-dark" onClick={Oldest}>
                Oldest
              </button>
              <button className="btn btn-sm btn-outline-dark" onClick={Newest}>
                Newest
              </button>
            </div>
          </div>
        </div>
        <div className="row m-0 mt-2 col-12 gap-1 px-sm-2">
          {presetList.map((test, index) => (
            <div
              className="px-3 py-2 border border-dark rounded col-12"
              key={index}
              onClick={() => handleTestClick(test)}
            >
              <div className="d-flex justify-content-between">
                {/* Displaying TESTNAME and UID */}
                <span>
                  TESTNAME: {test.TESTNAME}, UID: {test.UID} </span>
              </div>
              {/* Display questions for the selected test */}
              {selectedTest && selectedTest.UID === test.UID && (
                <div>
                  {renderQuestions(selectedTest.questions)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default Preset;