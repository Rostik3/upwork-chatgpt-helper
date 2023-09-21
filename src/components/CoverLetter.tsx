import { useEffect, useState } from "react";
import Response from "./Response";
import TextArea from "./Textarea";
import {
  addCoverLetter,
  deleteCoverLetter,
  initDB,
  updateCoverLetter,
} from "../lib/indexedDB";
import Button from "./Button";
import { getResponse } from "../lib/openai";
import Loader from "./Loader";
import {
  CopyIcon,
  DeleteIcon,
  EditIcon,
  PlusIcon,
  SaveIcon,
} from "../lib/icons";
import { useMainContext } from "./MainContextProvider";

const CoverLetter = () => {
  const [value, setValue] = useState("");
  const [openAIPromptValue, setOpenAIPromptValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChatGPTMode, setIsChatGPTMode] = useState(false);

  const { user, coverLetter, setCoverLetter } = useMainContext();

  const handleAddCoverLetter = async () => {
    const db = await initDB();
    const newCoverLetterObj = { text: value };
    await addCoverLetter(newCoverLetterObj, db);
    setCoverLetter({ id: 1, text: value });
    setIsEditMode(false);
    setIsChatGPTMode(false);
  };

  const handleUpdateCoverLetter = async (id: number, newText: string) => {
    const db = await initDB();
    const updatedNote = { id, text: newText };
    await updateCoverLetter(updatedNote, db);
    setCoverLetter({ id, text: value });
    setIsChatGPTMode(false);
  };

  const handleDeleteCoverLetter = async (id: number) => {
    const db = await initDB();
    await deleteCoverLetter(id, db);
    setValue("");
    setCoverLetter(undefined);
  };

  const getOpenAIResponse = async () => {
    setIsEditMode(false);
    setLoading(true);

    try {
      const response = await getResponse(openAIPromptValue, true, user!);

      if (response) {
        setValue(response);
      }

      setLoading(false);
    } catch (error: any) {
      console.error(`Error: ${error}`);
      setValue(error.message as string);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coverLetter) {
      setValue(coverLetter.text);
    }
  }, [coverLetter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <div>
      <div className="flex items-center mb-1">
        <p className="text-lg font-semibold text-white mr-2">Cover Letter</p>
        {isCopied ? (
          <SaveIcon className="text-emerald-500" />
        ) : (
          <button
            disabled={isEditMode}
            title="Copy"
            onClick={() => {
              setIsCopied(true);
              navigator.clipboard.writeText(value);
            }}
          >
            <CopyIcon className="text-white hover:text-emerald-500" />
          </button>
        )}
      </div>
      {isEditMode ? (
        <TextArea
          placeholder="Add text..."
          onChange={(e) => setValue(e.target.value)}
          defaultValue={value}
        />
      ) : (
        <>
          {value && !loading ? (
            <Response text={value} />
          ) : (
            <>
              {loading ? (
                <Loader />
              ) : (
                <p className="text-white">
                  Add your cover letter template or use ChatGPT assistance
                </p>
              )}
            </>
          )}
        </>
      )}
      <div className="mt-2 flex">
        <Button
          disabled={loading || (!isEditMode && !isChatGPTMode)}
          className="w-11 h-9 mr-2 bg-green-600"
          onClick={async () => {
            if (coverLetter?.text) {
              await handleUpdateCoverLetter(coverLetter?.id!, value);
            } else {
              await handleAddCoverLetter();
            }

            setIsEditMode(false);
          }}
        >
          <SaveIcon />
        </Button>
        <Button
          disabled={loading}
          className="w-11 h-9 mr-2 bg-yellow-400"
          onClick={() => setIsEditMode(true)}
        >
          {value ? <EditIcon /> : <PlusIcon />}
        </Button>
        <Button
          disabled={loading || !coverLetter?.text}
          className="w-11 h-9 mr-2 bg-red-400"
          onClick={() => handleDeleteCoverLetter(coverLetter?.id!)}
        >
          <DeleteIcon />
        </Button>
        <Button
          disabled={loading}
          className="h-9"
          onClick={() => setIsChatGPTMode(!isChatGPTMode)}
        >
          ChatGPT
          <img className="h-6 ml-1" src="/gpt-logo.png" alt="chatGPT-logo" />
        </Button>
      </div>
      {isChatGPTMode && !loading && (
        <div className="mt-2">
          <TextArea
            placeholder="Add specific requirements or leave input blank to generate CL based on your personal info"
            defaultValue={openAIPromptValue}
            onChange={(e) => setOpenAIPromptValue(e.target.value)}
          />
          <Button
            className="w-full"
            text="Generate cover letter"
            onClick={() => getOpenAIResponse()}
            disabled={false}
          />
        </div>
      )}
    </div>
  );
};

export default CoverLetter;
