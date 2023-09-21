import { useEffect, useState } from "react";
import TextArea from "./Textarea";
import {
  addQuestion,
  deleteQuestion,
  initDB,
  updateQuestion,
} from "../lib/indexedDB";
import Button from "./Button";
import { getResponse } from "../lib/openai";
import Loader from "./Loader";
import Response from "./Response";
import { CopyIcon, DeleteIcon, EditIcon, SaveIcon } from "../lib/icons";
import { useMainContext } from "./MainContextProvider";

const QuestionsList = () => {
  const [error, setError] = useState("");
  const [questionValue, setQuestionValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyId, setCopyId] = useState(0);

  const { user, questions, setQuestions } = useMainContext();

  const handleQuestionAdd = async (
    questionText: string,
    answerText: string
  ) => {
    const db = await initDB();
    const newQuestion = { question: questionText, answer: answerText };
    await addQuestion(newQuestion, db);
    setQuestions((prevData) => [
      { ...prevData[0], isSavedQuestion: true },
      ...prevData.slice(1),
    ]);
  };

  const handleQuestionUpdate = async (
    id: number,
    questionText: string,
    answerText: string
  ) => {
    const db = await initDB();
    const updatedQuestion = {
      id,
      question: questionText,
      answer: answerText,
      isEditMode: false,
      isSavedQuestion: true,
    };
    await updateQuestion(updatedQuestion, db);
    const updatedQuestions = questions.map((q) =>
      q.id === id ? updatedQuestion : q
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionDelete = async (id: number) => {
    const db = await initDB();
    await deleteQuestion(id, db);
    const updatedQuestios = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestios);
  };

  const getOpenAIResponse = async () => {
    setLoading(true);

    try {
      const response = await getResponse(questionValue, false, user!);

      if (response) {
        setQuestions((prevData) => [
          {
            id: questions?.length ? questions[0].id! + 1 : 1,
            question: questionValue,
            answer: response,
            isEditMode: false,
            isSavedQuestion: false,
          },
          ...prevData,
        ]);
      }

      setError("");
      setLoading(false);
    } catch (error: any) {
      console.error(`Error: ${error}`);
      setError(error.message as string);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyId(0);
    }, 5000);

    return () => clearTimeout(timer);
  }, [copyId]);

  return (
    <div>
      <p className="text-lg font-semibold mb-2 text-white">
        Job Applications Questions
      </p>
      <TextArea
        rows={1}
        placeholder="Feel free to ask contract specific question..."
        onChange={(e) => setQuestionValue(e.target.value)}
      />
      <Button
        className="w-full mb-3"
        onClick={() => getOpenAIResponse()}
        disabled={!questionValue}
      />
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {!questions?.length && !loading ? (
        <p className="text-center my-2 text-white">
          You haven't asked anything for now
        </p>
      ) : (
        <>
          {loading && <Loader />}
          {questions
            .sort((a, b) => b.id! - a.id!)
            .map((q, i) => (
              <div key={q.id}>
                <div className="flex items-center mb-1">
                  <p className="my-2 font-medium text-white mr-2">
                    {`${i + 1})`} {q.question}
                  </p>
                  {copyId === q.id ? (
                    <SaveIcon className="text-emerald-500" />
                  ) : (
                    <button
                      disabled={q.isEditMode}
                      title="Copy"
                      onClick={() => {
                        setCopyId(q.id!);
                        navigator.clipboard.writeText(q.answer);
                      }}
                    >
                      <CopyIcon className="text-white hover:text-emerald-500" />
                    </button>
                  )}
                </div>
                <>
                  {q.isEditMode ? (
                    <TextArea
                      placeholder="Add answer..."
                      defaultValue={q.answer}
                      onChange={(e) => {
                        setQuestions((prevData) => {
                          return prevData.map((el) => {
                            if (el.id === q.id) {
                              return { ...el, answer: e.target.value };
                            }

                            return el;
                          });
                        });
                      }}
                    />
                  ) : (
                    <Response text={q.answer} />
                  )}
                </>
                <div className="mt-2 flex">
                  <Button
                    className="w-11 h-9 mr-2 bg-green-600"
                    disabled={q.isSavedQuestion}
                    onClick={() => {
                      if (q.isEditMode) {
                        return handleQuestionUpdate(
                          q.id!,
                          q.question,
                          q.answer
                        );
                      }

                      handleQuestionAdd(q.question, q.answer);
                    }}
                  >
                    <SaveIcon />
                  </Button>
                  <Button
                    disabled={false}
                    className="w-11 h-9 mr-2 bg-yellow-400"
                    onClick={() => {
                      setQuestions((prevData) => {
                        return prevData.map((el) => {
                          if (el.id === q.id) {
                            return {
                              ...el,
                              isEditMode: true,
                              isSavedQuestion: false,
                            };
                          }

                          return el;
                        });
                      });
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    disabled={false}
                    className="w-11 h-9 mr-2 bg-red-400"
                    onClick={() => handleQuestionDelete(q.id!)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default QuestionsList;
