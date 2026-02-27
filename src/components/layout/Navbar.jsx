import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#050a14]/60 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] group-hover:text-white transition-colors duration-300" />
                        <span className="font-mono font-bold text-lg tracking-tight cyber-gradient-text drop-shadow-[0_0_2px_rgba(0,240,255,0.5)]">CNS<span className="text-white">PK</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['Home', 'Team', 'Events', 'Brand'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-all duration-300"
                            >
                                {item}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/cloud-native-security-pakistan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 rounded hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all duration-300"
                        >
                            Start_Hack()
                        </a>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Home', 'Team', 'Events', 'Brand'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar;
