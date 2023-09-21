import { Container } from "./components/Container";
import Divider from "./components/Divider";
import CoverLetter from "./components/CoverLetter";
import QuestionsList from "./components/QuestionsList";
import { Tabs, Tab } from "./components/Tabs";
import PersonalInfo from "./components/PersonalInfo";
import { MainProvider } from "./components/MainContextProvider";
import "./App.css";

function App() {
  return (
    <MainProvider>
      <Container>
        <Tabs>
          <Tab label="Main">
            <CoverLetter />
            <Divider />
            <QuestionsList />
          </Tab>
          <Tab label="Personal Info">
            <PersonalInfo />
          </Tab>
        </Tabs>
      </Container>
    </MainProvider>
  );
}

export default App;
