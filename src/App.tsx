import { BrowserRouter, Route, Routes } from "react-router-dom";
import Overview from "./pages/Overview";
import { AppPages } from "./base/enums";
import Homeworks from "./pages/Homeworks";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path={`/${AppPages.OVERVIEW.toLowerCase}`}
            element={<Overview />}
          />
          <Route
            path={`/${AppPages.HOMEWORKS.toLowerCase}`}
            element={<Homeworks />}
          />
          <Route
            path={`/${AppPages.EXAMS.toLowerCase}`}
            element={<Overview />}
          />
          <Route
            path={`/${AppPages.COLLECTION.toLowerCase}`}
            element={<Overview />}
          />
          <Route
            path={`/${AppPages.GROUPS.toLowerCase}`}
            element={<Overview />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
