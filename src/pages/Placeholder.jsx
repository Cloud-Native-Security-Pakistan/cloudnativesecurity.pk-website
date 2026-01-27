const Placeholder = ({ title }) => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-mono font-bold text-slate-700">{title}</h1>
            <p className="text-cyan-500 mt-2">Coming Soon...</p>
        </div>
    </div>
);
export default Placeholder;
