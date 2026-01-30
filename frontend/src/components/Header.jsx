import { Search, Bell, HelpCircle } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white px-8 py-5 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            <div className="flex items-center gap-6">
                {/* Actions removed as per request */}
            </div>
        </header>
    );
};

export default Header;
