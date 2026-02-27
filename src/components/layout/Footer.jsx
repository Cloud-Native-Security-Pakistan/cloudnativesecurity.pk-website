const Footer = () => (
    <footer className="relative bg-slate-950/80 backdrop-blur-md border-t border-cyan-500/20 py-12">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm font-mono hover:text-cyan-400 transition-colors duration-500">
            <p>&copy; {new Date().getFullYear()} Cloud Native Security Pakistan. Open Source & Community Driven.</p>
        </div>
    </footer>
);
export default Footer;
