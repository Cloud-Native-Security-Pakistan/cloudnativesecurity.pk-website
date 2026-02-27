const Footer = () => (
    <footer className="relative bg-[#050505] border-t border-white/5 py-12">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm font-sans hover:text-brand-500 transition-colors duration-500">
            <p>&copy; {new Date().getFullYear()} Cloud Native Security Pakistan. Open Source & Community Driven.</p>
        </div>
    </footer>
);
export default Footer;
