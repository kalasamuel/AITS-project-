import React from 'react';
import  {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import IssueForm from "./components/IssueForm";
function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/submit"
        element={<IssueForm/>}/>
      </Routes>
    </Router>  
 );
}
export default App;