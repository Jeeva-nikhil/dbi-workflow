import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkFlow from './components/workflow/WorkFlow';
import WorkFlowList from './components/workflow/WorkFlowList';
import Error403 from './components/Error403';

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    {/*<Route path='/:bearerToken?' element={<WorkFlowList />} />*/}
                    <Route path='/' element={<WorkFlowList />} />
                    <Route path='/workflow/:id' element={<WorkFlow />} />
                    <Route path='/erorr_403' element={<Error403 />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
