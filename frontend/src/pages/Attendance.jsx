import { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Search, CheckCircle, XCircle, Clock, MoreHorizontal, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import api from '../api';

const Attendance = () => {
    const [activeTab, setActiveTab] = useState('mark'); // 'mark' or 'history'
    const [employees, setEmployees] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({}); // { empId: { status: 'Present', note: '' } }
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        present: 0,
        total: 0,
        absenteeism: 2.8,
        lastWeek: 92.4
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);

            // Initialize attendance data
            const initialData = {};
            response.data.forEach(emp => {
                initialData[emp.id] = { status: 'Present', note: '' };
            });
            setAttendanceData(initialData);

            setStats(prev => ({ ...prev, total: response.data.length, present: response.data.length })); // Mock stats
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = (empId, newStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [empId]: { ...prev[empId], status: newStatus }
        }));
    };

    const handleNoteChange = (empId, note) => {
        setAttendanceData(prev => ({
            ...prev,
            [empId]: { ...prev[empId], note }
        }));
    };

    const markAllPresent = () => {
        const newData = { ...attendanceData };
        Object.keys(newData).forEach(key => {
            newData[key].status = 'Present';
        });
        setAttendanceData(newData);
    };

    const submitAttendance = async () => {
        if (!window.confirm(`Submit attendance for ${Object.keys(attendanceData).length} employees for ${date}?`)) return;

        // In a real app, you might want to send this as a bulk payload.
        // For now, we'll iterate (simplified).
        let successCount = 0;
        let diffCount = 0;

        // Only sending data that changed or if we want to enforce all
        // Ideally backend supports bulk insert.
        // We will try to loop for now as per previous logic, but maybe just one by one is slow.
        // Let's just alert for this UI demo if backend interaction is complex.

        try {
            const promises = Object.keys(attendanceData).map(async (empId) => {
                return api.post('/attendance/', {
                    employee_id: empId,
                    date: date,
                    status: attendanceData[empId].status,
                    // note: attendanceData[empId].note // Backend might need note field update
                });
            });

            await Promise.all(promises);
            alert("Attendance submitted successfully!");
        } catch (error) {
            console.error("Error submitting attendance", error);
            alert("Some records failed to update.");
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
    };

    const getAvatarColor = (index) => {
        const colors = [
            'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
            'bg-green-100 text-green-600', 'bg-orange-100 text-orange-600'
        ];
        return colors[index % colors.length];
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-gray-500 text-sm mt-1">Update daily status and review employee logs</p>
            </div>

            {/* Main Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setActiveTab('mark')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'mark' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Mark Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'history' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        View History
                    </button>
                </div>

                {activeTab === 'mark' && (
                    <div className="flex gap-3">
                        <button
                            onClick={markAllPresent}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Mark All Present
                        </button>
                        <button
                            onClick={submitAttendance}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <CheckCircle size={16} />
                            Submit Attendance
                        </button>
                    </div>
                )}
            </div>

            {/* Filter and Date Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Employee List Table */}
            {activeTab === 'mark' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                                ) : filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp, index) => (
                                        <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(index)}`}>
                                                        {getInitials(emp.full_name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{emp.full_name}</p>
                                                        <p className="text-xs text-gray-500">ID: #{String(emp.id).padStart(3, '0')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {emp.department || 'General'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex bg-gray-100 p-1 rounded-lg justify-center">
                                                    {['Present', 'Absent', 'Leave'].map(statusOption => (
                                                        <button
                                                            key={statusOption}
                                                            onClick={() => handleStatusChange(emp.id, statusOption)}
                                                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${attendanceData[emp.id]?.status === statusOption
                                                                    ? statusOption === 'Present' ? 'bg-white text-green-700 shadow-sm'
                                                                        : statusOption === 'Absent' ? 'bg-white text-red-700 shadow-sm'
                                                                            : 'bg-white text-orange-700 shadow-sm'
                                                                    : 'text-gray-500 hover:text-gray-700'
                                                                }`}
                                                        >
                                                            {statusOption}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="text"
                                                    placeholder="Add note..."
                                                    value={attendanceData[emp.id]?.note || ''}
                                                    onChange={(e) => handleNoteChange(emp.id, e.target.value)}
                                                    className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none text-sm py-1 transition-colors"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No employees found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Yesterday</p>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.present}/{stats.total}</p>
                            <p className="text-xs text-green-600 mt-1">Present (95.1%)</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Week Avg.</p>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.lastWeek}%</p>
                            <p className="text-xs text-orange-600 mt-1">-1.2% from previous</p>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Absenteeism Rate</p>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.absenteeism}%</p>
                            <p className="text-xs text-green-600 mt-1">Below industry avg.</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
