import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/brand/CNSP Logo Black.png" alt="CNSP Logo" className="h-10 w-auto filter invert brightness-200 group-hover:scale-105 transition-transform duration-300" />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['Home', 'Team', 'Events', 'Members', 'Brand'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-all duration-300"
                            >
                                {item}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/cloud-native-security-pakistan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-500 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-300"
                        >
                            Join Community
                        </a>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#050505] border-b border-white/5">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {['Home', 'Team', 'Events', 'Members', 'Brand'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/cloud-native-security-pakistan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-3 mt-4 text-center text-base font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-500"
                        >
                            Join Community
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar;
