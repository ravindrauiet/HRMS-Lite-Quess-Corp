import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Briefcase, User, ArrowLeft, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../api';

const EmployeeProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    const fetchEmployeeDetails = async () => {
        try {
            // Ideally we fetch from /employees/:id, but for now we might just Mock it if backend doesn't support specifics
            // or we use the basic info we can get.
            // Let's try to get all and find, or if the user allowed backend mods previously, maybe GET /employees/:id works.
            // But since "do not change backend" is checking now, we assume standard fields only.

            const response = await api.get('/employees/');
            const found = response.data.find(e => e.id === parseInt(id));

            if (found) {
                // Using real data from API. Fields not in DB will be undefined/null.
                setEmployee(found);
            }
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!employee) return <div className="p-8 text-center text-red-500">Employee not found</div>;

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

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
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                        <Download size={16} />
                        Export History
                    </button>
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
                        <p className="text-gray-500 text-lg">{employee.designation || 'N/A'} • {employee.department}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-gray-400" />
                            <span>ID: EMP-{String(employee.id).padStart(4, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{employee.location || 'N/A'}</span>
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

                            <div className="group">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Date Joined</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Calendar size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                    <span>{employee.date_joined ? new Date(employee.date_joined).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Manager</label>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {getInitials(employee.manager_name || '??')}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{employee.manager_name || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                        <h4 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                            Emergency Contact
                        </h4>
                        <p className="font-medium text-gray-900">Jane Doe (Spouse)</p>
                        <p className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline">+1 (555) 000-1234</p>
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
                            <p className="text-2xl font-bold text-gray-900">156 Days</p>
                            <p className="text-xs text-gray-400 mt-1">Last 6 months</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-500 font-medium">Total Absent</p>
                                <XCircle size={16} className="text-red-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">4 Days</p>
                            <p className="text-xs text-gray-400 mt-1">Excludes holidays</p>
                        </div>
                        <div className="bg-blue-600 p-5 rounded-xl shadow-sm shadow-blue-200 text-white">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-blue-100 font-medium">Attendance Rate</p>
                                <div className="p-1 bg-white/20 rounded">
                                    <Clock size={12} className="text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold">97.5%</p>
                            <div className="w-full bg-blue-800/50 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: '97.5%' }}></div>
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
                                October 2024
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
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-gray-900">Oct {24 - i}, 2024</td>
                                            <td className="px-6 py-4 text-gray-500">Regular (9AM-6PM)</td>
                                            <td className="px-6 py-4 text-gray-500">08:55 AM</td>
                                            <td className="px-6 py-4 text-gray-500">06:05 PM</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${i === 2
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {i === 2 ? 'Absent' : 'Present'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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
