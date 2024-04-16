import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationLinks } from "./base/enums";
import Sidebar from "./components/navigation/Sidebar";
import { formatNavLinkAsPath } from "./utils";
import { Collection, Exams, Groups, Homeworks, Overview } from "./pages/Index";
import SchoolSubjectsInitSystem from "./systems/SchoolSubjectsInitSystem";


function App() {
  return (
    <div>
      <SchoolSubjectsInitSystem />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Collection />} />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.OVERVIEW)}
            element={<Overview />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.HOMEWORKS)}
            element={<Homeworks />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.EXAMS)}
            element={<Exams />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.COLLECTION)}
            element={<Collection />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.GROUPS)}
            element={<Groups />}
          />
        </Routes>
        {/* <Sidebar /> */}
      </BrowserRouter>
    </div>
  );
}
2;

export default App;
