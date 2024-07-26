import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkFlow from './components/workflow/WorkFlow';
import WorkFlowList from './components/workflow/WorkFlowList';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/:bearerToken?' element={<WorkFlowList />} />
          <Route path='/workflow/:id' element={<WorkFlow />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
