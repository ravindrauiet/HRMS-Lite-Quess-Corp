import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Briefcase, User, ArrowLeft, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../api';

const EmployeeProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [empRes, attRes] = await Promise.all([
                api.get('/employees/'),
                api.get(`/attendance/${id}`)
            ]);

            const found = empRes.data.find(e => e.id === parseInt(id));
            if (found) {
                setEmployee(found);
            }
            setAttendance(attRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!employee) return <div className="p-8 text-center text-red-500">Employee not found</div>;

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

    // Calculate Stats
    const totalPresent = attendance.filter(a => a.status === 'Present').length;
    const totalAbsent = attendance.filter(a => a.status === 'Absent').length;
    const totalRecords = attendance.length;
    const attendanceRate = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Navigation & Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/employees')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Directory</span>
                </button>
                <div className="flex gap-3">
                    {/* Buttons removed as per request */}
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {getInitials(employee.full_name)}
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{employee.full_name}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase tracking-wide">
                                {employee.status || 'Active'}
                            </span>
                        </div>
                        <p className="text-gray-500 text-lg">{employee.designation || 'Employee'} • {employee.department}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-gray-400" />
                            <span>ID: EMP-{String(employee.id).padStart(4, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee Overview Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
                            <User size={18} className="text-blue-600" />
                            Employee Overview
                        </h3>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Mail size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <span className="truncate">{employee.email}</span>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Department</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Briefcase size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    <span>{employee.department}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Stats & Attendance */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-500 font-medium">Total Present</p>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{totalPresent} Days</p>
                            <p className="text-xs text-gray-400 mt-1">Overall</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-500 font-medium">Total Absent</p>
                                <XCircle size={16} className="text-red-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{totalAbsent} Days</p>
                            <p className="text-xs text-gray-400 mt-1">Overall</p>
                        </div>
                        <div className="bg-blue-600 p-5 rounded-xl shadow-sm shadow-blue-200 text-white">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-blue-100 font-medium">Attendance Rate</p>
                                <div className="p-1 bg-white/20 rounded">
                                    <Clock size={12} className="text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{attendanceRate}%</p>
                            <div className="w-full bg-blue-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar size={18} className="text-blue-600" />
                                Attendance History
                            </h3>
                            <button className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                                All Records
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Shift</th>
                                        <th className="px-6 py-3 font-medium">Check In</th>
                                        <th className="px-6 py-3 font-medium">Check Out</th>
                                        <th className="px-6 py-3 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attendance.length > 0 ? (
                                        attendance.slice().reverse().map((record, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {new Date(record.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">Regular</td>
                                                <td className="px-6 py-4 text-gray-500">N/A</td>
                                                <td className="px-6 py-4 text-gray-500">N/A</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'Absent'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                                No attendance records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-center">
                            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                View Full History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;

