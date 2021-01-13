import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import SqlAnalysisPage from "./components/pages/SqlAnalysisPage";
import HomePage from "./components/pages/HomePage";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={SqlAnalysisPage} exact />
      </Switch>
    </Router>
  );
};

export default App;
