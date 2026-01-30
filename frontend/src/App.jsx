import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
