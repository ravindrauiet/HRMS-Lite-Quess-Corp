import { LayoutDashboard, Users, Calendar, Settings, Building2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-none">HRMS Lite</h1>
                    <span className="text-xs text-gray-500 font-medium">Admin Panel</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                    }
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/employees"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                    }
                >
                    <Users size={20} />
                    Employees
                </NavLink>
                <NavLink
                    to="/attendance"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                    }
                >
                    <Calendar size={20} />
                    Attendance
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                    }
                >
                    <Settings size={20} />
                    Settings
                </NavLink>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border-2 border-white shadow-sm">
                        RJ
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">Ravindra Jha</p>
                        <p className="text-xs text-gray-500 truncate">System Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
