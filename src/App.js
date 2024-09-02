import logo from './logo.svg';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkFlow from './components/workflow/WorkFlow';
import WorkFlowList from './components/workflow/WorkFlowList';
import Error403 from './components/Error403';
import Login from './login';
import ZylerWorkflowList from './components/zyler-workflow/WorkFlowList';
import ZylerWorkflow from './components/zyler-workflow/WorkFlow';

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path='/' element={<WorkFlowList />} />
                    <Route path='/zyler_autologin/:bearerToken' element={<Login />} />
                    <Route path='/workflow/:id' element={<WorkFlow />} />
                    <Route path='/erorr_403' element={<Error403 />} />
                    <Route path='/zylerworkflowlist' element={< ZylerWorkflowList />} />
                    <Route path='/zylerworkflowl/:id' element={< ZylerWorkflow />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
