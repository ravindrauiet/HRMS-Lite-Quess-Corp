import { useState, useEffect } from 'react';
import api from '../api';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [status, setStatus] = useState('Present');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewEmployeeId, setViewEmployeeId] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        try {
            await api.post('/attendance/', {
                employee_id: selectedEmployee,
                date: date,
                status: status
            });
            alert("Attendance marked successfully!");
            // Refresh view if viewing same employee
            if (viewEmployeeId === selectedEmployee) {
                fetchAttendance(viewEmployeeId);
            }
        } catch (error) {
            alert("Error marking attendance: " + (error.response?.data?.detail || error.message));
        }
    };

    const fetchAttendance = async (empId) => {
        if (!empId) return;
        try {
            const response = await api.get(`/attendance/${empId}`);
            setAttendanceRecords(response.data);
            setViewEmployeeId(empId);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Mark Attendance Section */}
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
                    <form onSubmit={handleMarkAttendance}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Employee</label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input
                                type="date"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Mark Confirmation
                        </button>
                    </form>
                </div>

                {/* View Attendance Section */}
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-xl font-semibold mb-4">View Records</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Select Employee to View</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                            onChange={(e) => fetchAttendance(e.target.value)}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                            ))}
                        </select>
                    </div>

                    {attendanceRecords.length > 0 ? (
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{record.date}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${record.status === 'Present' ? 'text-green-900' : 'text-red-900'}`}>
                                                <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${record.status === 'Present' ? 'bg-green-200' : 'bg-red-200'}`}></span>
                                                <span className="relative">{record.status}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 italic">No records to display (Select an employee).</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
