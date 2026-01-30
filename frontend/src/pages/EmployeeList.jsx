import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await api.delete(`/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employees</h1>
                <Link to="/add-employee" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Add New Employee
                </Link>
            </div>
            <div className="bg-white shadow-md rounded overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.id}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.full_name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{emp.department}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {employees.length === 0 && <p className="text-center py-4 text-gray-500">No employees found.</p>}
            </div>
        </div>
    );
};

export default EmployeeList;
