import { Search, Bell, HelpCircle } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white px-8 py-5 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-blue-100 w-64 transition-all"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
