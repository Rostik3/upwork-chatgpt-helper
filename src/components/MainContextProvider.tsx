import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ICoverLetter,
  IQuestion,
  IUser,
  getCoverLetter,
  getQuestions,
  getUser,
  initDB,
} from "../lib/indexedDB";

export interface QuestionListElement extends IQuestion {
  isEditMode: boolean;
  isSavedQuestion: boolean;
}

interface MainContextProps {
  user: IUser | undefined;
  activeTab: string | null;
  questions: QuestionListElement[];
  coverLetter: ICoverLetter | undefined;
  isPersonalInfoFilled: boolean;
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
  setQuestions: Dispatch<SetStateAction<QuestionListElement[]>>;
  setCoverLetter: Dispatch<SetStateAction<ICoverLetter | undefined>>;
  setIsPersonalInfoFilled: Dispatch<SetStateAction<boolean>>;
}

interface MainProviderProps {
  children: ReactNode;
}

const MainContext = createContext<MainContextProps>(null!);

export const MainProvider = ({ children }: MainProviderProps) => {
  const [coverLetter, setCoverLetter] = useState<ICoverLetter>();
  const [questions, setQuestions] = useState<QuestionListElement[]>([]);
  const [isPersonalInfoFilled, setIsPersonalInfoFilled] = useState(true);
  const [user, setUser] = useState<IUser>();
  const [activeTab, setActiveTab] = useState<string | null>("Main");

  const fetchData = async () => {
    const db = await initDB();

    const userData = await getUser(db);
    const questionsData = await getQuestions(db);
    const coverLetterData = await getCoverLetter(db);

    setUser(userData[0]);
    setQuestions(
      questionsData.map((q) => ({
        ...q,
        isEditMode: false,
        isSavedQuestion: true,
      }))
    );
    setCoverLetter({
      id: coverLetterData[0]?.id,
      text: coverLetterData[0]?.text,
    });
    setIsPersonalInfoFilled(!!userData.length);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const value = {
    user,
    activeTab,
    questions,
    coverLetter,
    isPersonalInfoFilled,
    setUser,
    setActiveTab,
    setQuestions,
    setCoverLetter,
    setIsPersonalInfoFilled,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainContext = (): MainContextProps => {
  const value = useContext(MainContext);

  if (!value) {
    throw new Error("useMainContext must be used inside MainProvider");
  }

  return value;
};
