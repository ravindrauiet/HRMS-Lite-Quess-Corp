import { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Search, CheckCircle, XCircle, Clock, MoreHorizontal, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import api from '../api';

const Attendance = () => {
    const [activeTab, setActiveTab] = useState('mark'); // 'mark' or 'history'
    const [employees, setEmployees] = useState([]);
    const [allAttendance, setAllAttendance] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({}); // { empId: { status: 'Present', note: '' } }
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        yesterday: { present: 0, total: 0, percentage: 0 },
        lastWeek: 0,
        absenteeism: 0
    });

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([fetchEmployees(), fetchAllAttendance()]);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (employees.length > 0) {
            loadAttendanceForDate(date);
        }
    }, [date, employees, allAttendance]);

    useEffect(() => {
        if (allAttendance.length > 0 && employees.length > 0) {
            calculateStats();
        }
    }, [allAttendance, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            return [];
        }
    };

    const fetchAllAttendance = async () => {
        try {
            const response = await api.get('/attendance/');
            setAllAttendance(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching attendance history:", error);
            return [];
        }
    };

    const loadAttendanceForDate = (selectedDate) => {
        const initialData = {};
        employees.forEach(emp => {
            const record = allAttendance.find(a => a.employee_id === emp.id && a.date === selectedDate);
            initialData[emp.id] = {
                status: record ? record.status : 'Present',
                note: '', // Notes are not yet in DB schema
                id: record ? record.id : null
            };
        });
        setAttendanceData(initialData);
    };

    const calculateStats = () => {
        const today = new Date();
        const yesterdayDate = new Date(today);
        yesterdayDate.setDate(today.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

        // Yesterday Stats
        const yesterdayRecords = allAttendance.filter(a => a.date === yesterdayStr);
        const yesterdayPresent = yesterdayRecords.filter(a => a.status === 'Present').length;
        const totalEmployees = employees.length;

        // Last Week Avg
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7);
        const lastWeekRecords = allAttendance.filter(a => new Date(a.date) >= lastWeekStart && new Date(a.date) < today);
        const lastWeekPresent = lastWeekRecords.filter(a => a.status === 'Present').length;
        const lastWeekDays = 7; // Assuming 7 days for simplicity, or count unique dates
        const lastWeekAvg = lastWeekRecords.length > 0 ? (lastWeekPresent / lastWeekRecords.length) * 100 : 0;

        // Absenteeism Rate (Overall Absent / Total Records)
        const totalAbsent = allAttendance.filter(a => a.status === 'Absent').length;
        const absenteeism = allAttendance.length > 0 ? (totalAbsent / allAttendance.length) * 100 : 0;

        setStats({
            yesterday: {
                present: yesterdayPresent,
                total: yesterdayRecords.length || totalEmployees,
                percentage: yesterdayRecords.length > 0 ? (yesterdayPresent / yesterdayRecords.length) * 100 : 0
            },
            lastWeek: lastWeekAvg.toFixed(1),
            absenteeism: absenteeism.toFixed(1)
        });
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

        setIsLoading(true);
        try {
            const promises = Object.keys(attendanceData).map(async (empId) => {
                const data = attendanceData[empId];
                return api.post('/attendance/', {
                    employee_id: parseInt(empId),
                    date: date,
                    status: data.status
                });
            });

            await Promise.all(promises);
            alert("Attendance submitted successfully!");
            await fetchAllAttendance(); // Refresh history and stats
        } catch (error) {
            console.error("Error submitting attendance", error);
            alert("Some records failed to update.");
        } finally {
            setIsLoading(false);
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

    const getFilteredHistory = () => {
        return allAttendance
            .filter(a => {
                const emp = employees.find(e => e.id === a.employee_id);
                return emp?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .slice()
            .reverse();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
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
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <CheckCircle size={16} />
                            {isLoading ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </div>
                )}
            </div>

            {/* Filter and Date Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {activeTab === 'mark' && (
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    )}
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                {activeTab === 'history' && (
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                )}
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Status</th>
                                {activeTab === 'mark' && (
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : (activeTab === 'mark' ? filteredEmployees : getFilteredHistory()).length > 0 ? (
                                (activeTab === 'mark' ? filteredEmployees : getFilteredHistory()).map((item, index) => {
                                    const emp = activeTab === 'mark' ? item : employees.find(e => e.id === item.employee_id);
                                    if (!emp) return null;

                                    return (
                                        <tr key={activeTab === 'mark' ? emp.id : item.id} className="hover:bg-gray-50/50 transition-colors">
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
                                            {activeTab === 'history' && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {emp.department || 'General'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {activeTab === 'mark' ? (
                                                    <div className="flex bg-gray-100 p-1 rounded-lg justify-center">
                                                        {['Present', 'Absent'].map(statusOption => (
                                                            <button
                                                                key={statusOption}
                                                                onClick={() => handleStatusChange(emp.id, statusOption)}
                                                                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${attendanceData[emp.id]?.status === statusOption
                                                                    ? statusOption === 'Present' ? 'bg-white text-green-700 shadow-sm'
                                                                        : 'bg-white text-red-700 shadow-sm'
                                                                    : 'text-gray-500 hover:text-gray-700'
                                                                    }`}
                                                            >
                                                                {statusOption}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Absent'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            {activeTab === 'mark' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        placeholder="Add note..."
                                                        value={attendanceData[emp.id]?.note || ''}
                                                        onChange={(e) => handleNoteChange(emp.id, e.target.value)}
                                                        className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none text-sm py-1 transition-colors"
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No records found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Yesterday</p>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.yesterday.present}/{stats.yesterday.total}</p>
                            <p className={`text-xs mt-1 ${stats.yesterday.percentage >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                                Present ({stats.yesterday.percentage.toFixed(1)}%)
                            </p>
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
                            <p className="text-xs text-gray-500 mt-1">Based on records</p>
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
                            <p className="text-xs text-green-600 mt-1">Overall</p>
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
