import React, { ReactNode, useEffect } from "react";
import { useMainContext } from "./MainContextProvider";

type TabsProps = {
  children: ReactNode;
};

type TabProps = {
  label: string;
  children: ReactNode;
};

const Tabs = ({ children }: TabsProps) => {
  const { activeTab, isPersonalInfoFilled, setActiveTab } = useMainContext();

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    newActiveTab: string
  ) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  useEffect(() => {
    if (!isPersonalInfoFilled) {
      return setActiveTab("Personal Info");
    }

    setActiveTab("Main");
  }, [setActiveTab, isPersonalInfoFilled]);

  return (
    <>
      <div className="flex border-b border-white border-opacity-25">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<TabProps>(child)) {
            const tabProps = child.props as TabProps;
            return (
              <button
                disabled={!isPersonalInfoFilled}
                key={tabProps.label}
                className={`${
                  activeTab === tabProps.label
                    ? "border-b-2 border-emerald-500"
                    : ""
                } flex-1 text-gray-700 font-medium py-2 text-white`}
                onClick={(e) => handleClick(e, tabProps.label)}
              >
                {tabProps.label}
              </button>
            );
          }
          return null;
        })}
      </div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabProps>(child)) {
          const tabProps = child.props as TabProps;
          if (tabProps.label === activeTab) {
            return <div key={tabProps.label}>{tabProps.children}</div>;
          }
        }
        return null;
      })}
    </>
  );
};

const Tab = ({ children }: TabProps) => {
  return <div className="hidden">{children}</div>;
};

export { Tabs, Tab };
