import { useState } from "react";
import Button from "./Button";
import { addUser, initDB, updateUser } from "../lib/indexedDB";
import { useMainContext } from "./MainContextProvider";

const PersonalInfo = () => {
  const { user, isPersonalInfoFilled, setActiveTab } = useMainContext();
  const [formValues, setFormValues] = useState<{
    id: number;
    name: string;
    jobTitle: string;
    yearsOfExperience: string;
    skills: string;
  }>({
    id: 1,
    name: user?.name || "",
    jobTitle: user?.jobTitle || "",
    yearsOfExperience: user?.yearsOfExperience || "",
    skills: user?.skills || "",
  });

  const handleQuestionAdd = async (
    name: string,
    jobTitle: string,
    yearsOfExperience: string,
    skills: string
  ) => {
    const db = await initDB();
    const newUser = { name, jobTitle, yearsOfExperience, skills };
    await addUser(newUser, db);
  };

  const handleQuestionUpdate = async (
    id: number,
    name: string,
    jobTitle: string,
    yearsOfExperience: string,
    skills: string
  ) => {
    const db = await initDB();
    const updatedUser = { id, name, jobTitle, yearsOfExperience, skills };
    await updateUser(updatedUser, db);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { id, name, jobTitle, yearsOfExperience, skills } = formValues;

    if (isPersonalInfoFilled) {
      await handleQuestionUpdate(id, name, jobTitle, yearsOfExperience, skills);
    } else {
      await handleQuestionAdd(name, jobTitle, yearsOfExperience, skills);
    }

    setActiveTab("Main");
  };

  return (
    <div>
      {!isPersonalInfoFilled && (
        <p className="text-emerald-500">
          Please tell us about yourself, before using the app
        </p>
      )}
      <div className="mb-2">
        <p className="text-lg font-semibold text-white mb-1">Name</p>
        <input
          type="text"
          name="name"
          placeholder="e.g. John Doe"
          value={formValues.name}
          onChange={handleInputChange}
          className="block p-2 w-full rounded-md border-[0.5px] border-white-300 text-white bg-[#40414F] shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <p className="text-lg font-semibold text-white mb-1">Job Title</p>
        <input
          type="text"
          name="jobTitle"
          placeholder="e.g. Fullstack Developer"
          value={formValues.jobTitle}
          onChange={handleInputChange}
          className="block p-2 w-full rounded-md border-[0.5px] border-white-300 text-white bg-[#40414F] shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <p className="text-lg font-semibold text-white mb-1">
          Years of Experience
        </p>
        <input
          type="text"
          name="yearsOfExperience"
          placeholder="e.g. 5"
          value={formValues.yearsOfExperience}
          onChange={handleInputChange}
          className="block p-2 w-full rounded-md border-[0.5px] border-white-300 text-white bg-[#40414F] shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <p className="text-lg font-semibold text-white mb-1">
          Technologies and Skills
        </p>
        <input
          type="text"
          name="skills"
          placeholder="e.g. React, Node.js, Microservices"
          value={formValues.skills}
          onChange={handleInputChange}
          className="block p-2 w-full rounded-md border-[0.5px] border-white-300 text-white bg-[#40414F] shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        />
      </div>
      <Button
        className="w-full"
        text="Save"
        disabled={
          !formValues.name ||
          !formValues.jobTitle ||
          !formValues.yearsOfExperience ||
          !formValues.skills ||
          (formValues.name === user?.name &&
            formValues.jobTitle === user?.jobTitle &&
            formValues.yearsOfExperience === user?.yearsOfExperience &&
            formValues.skills === user?.skills)
        }
        onClick={handleSubmit}
      />
    </div>
  );
};

export default PersonalInfo;
