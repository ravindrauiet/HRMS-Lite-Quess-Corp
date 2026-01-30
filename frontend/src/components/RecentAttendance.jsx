import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const RecentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employees first to map IDs to names/images
                const empResponse = await api.get('/employees/');
                const employeesMap = {};
                empResponse.data.forEach(emp => {
                    employeesMap[emp.id] = {
                        name: emp.full_name,
                        // Use a deterministic avatar service based on name/email
                        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name)}&background=random&color=fff`
                    };
                });

                // Fetch recent attendance
                // We'll fetch a batch and then slice the top 5 most recent if the API returns them in default order (usually insertion order)
                // If backend doesn't sort by date desc, we might need to sort here.
                const attResponse = await api.get('/attendance/?limit=20');

                // Assuming attResponse.data is list of {id, date, status, employee_id}
                // Sort by ID desc (proxy for recent) or date desc
                const sortedData = attResponse.data.sort((a, b) => b.id - a.id).slice(0, 5);

                const tableData = sortedData.map(record => ({
                    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    employee: employeesMap[record.employee_id] || { name: 'Unknown', image: 'https://ui-avatars.com/api/?name=Unknown' },
                    status: record.status
                }));

                setAttendanceData(tableData);

            } catch (error) {
                console.error("Error fetching recent attendance:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Recent Attendance</h3>
                <Link to="/attendance" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {attendanceData.length > 0 ? (
                            attendanceData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img className="h-9 w-9 rounded-full object-cover" src={row.employee.image} alt="" />
                                            <div className="text-sm font-medium text-gray-900">{row.employee.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Present'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500 text-sm">
                                    No recent records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentAttendance;
