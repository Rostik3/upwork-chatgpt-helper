import OpenAI from "openai";
import { IUser } from "./indexedDB";

const getCoverLetterQueryText = (text: string, userData: IUser) => {
  return `
    Generate a template for the Upwork job application cover letter, considering my personal data,
    Name: ${userData.name}; Job Title: ${
    userData.jobTitle
  }; Years of experience: ${
    userData.yearsOfExperience
  }; Technologies or skills: ${userData.skills};
    ${text ? `Additional requirements: ${text}` : ""}
  `;
};

const getQuestionQueryText = (text: string, userData: IUser) => {
  return `
    Answer next question - ${text}, imagine that this was asked of a person with the following characteristics,
    Job Title: ${userData.jobTitle}; Technologies or skills: ${userData.skills};
  `;
};

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_API_KEY,
  dangerouslyAllowBrowser: true,
});

const getResponse = async (
  text: string,
  isCoverLetter: boolean,
  userData: IUser
): Promise<string | null> => {
  console.log("QUESTION: ", { text, isCoverLetter, userData });
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: isCoverLetter
          ? getCoverLetterQueryText(text, userData)
          : getQuestionQueryText(text, userData),
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices?.[0].message.content;
};

export { getResponse };
