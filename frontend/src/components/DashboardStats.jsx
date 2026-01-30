import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api';

const DashboardStats = () => {
    const [stats, setStats] = useState([
        {
            title: 'Total Employees',
            value: '-',
            trend: '+2%', // Mock trend for now
            trendUp: true,
            icon: Users,
            color: 'blue',
            meta: 'Total Employees'
        },
        {
            title: 'Present Today',
            value: '-',
            trend: 'Automated', // Dynamic
            trendUp: true,
            icon: UserCheck,
            color: 'green',
            meta: 'Present Today'
        },
        {
            title: 'Absent Today',
            value: '-',
            trend: 'Automated', // Dynamic
            trendUp: false,
            icon: UserX,
            color: 'red',
            meta: 'Absent Today'
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Total Employees
                const empResponse = await api.get('/employees/');
                const totalEmployees = empResponse.data.length;

                // 2. Fetch Today's Attendance
                // Since we don't have a specific endpoint for today, we fetch latest records and filter
                // Ideally this should be a backend endpoint like /attendance/status?date=...
                const attendanceResponse = await api.get('/attendance/?limit=200'); // Fetch enough records
                const today = new Date().toISOString().split('T')[0];

                const todaysRecords = attendanceResponse.data.filter(record => record.date === today);
                const presentCount = todaysRecords.filter(r => r.status === 'Present').length;
                const absentCount = todaysRecords.filter(r => r.status === 'Absent').length;

                // Calculate percentages roughly for trends
                const presentPercentage = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;
                const absentPercentage = totalEmployees > 0 ? Math.round((absentCount / totalEmployees) * 100) : 0;

                setStats([
                    {
                        title: 'Total Employees',
                        value: totalEmployees,
                        trend: '+2%', // Kept static for demo
                        trendUp: true,
                        icon: Users,
                        color: 'blue',
                        meta: 'Total Employees'
                    },
                    {
                        title: 'Present Today',
                        value: presentCount,
                        trend: `${presentPercentage}%`,
                        trendUp: true,
                        icon: UserCheck,
                        color: 'green',
                        meta: 'Present Today'
                    },
                    {
                        title: 'Absent Today',
                        value: absentCount,
                        trend: `${absentPercentage}%`,
                        trendUp: false, // Low absence is good, but usually red means alert. High absence is bad.
                        // Design shows "Absent Today" with red trend arrow down (maybe meaning "down is good"? or just "negative stat"). 
                        // In design: Absent Today 6, Trend arrow says "5%" (Red, Zigzag down). 
                        // I will assume the design means "5% rate".
                        icon: UserX,
                        color: 'red',
                        meta: 'Absent Today'
                    }
                ]);

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchData();
    }, []);

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 text-blue-600';
            case 'green': return 'bg-green-50 text-green-600';
            case 'red': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {stat.trend}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">{stat.meta}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
