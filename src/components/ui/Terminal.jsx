import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = ({ title = "bash", children }) => {
    return (
        <div className="font-mono bg-[#0d1117] border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 ml-4 text-xs text-slate-400">
                    <TerminalIcon size={12} />
                    <span>{title}</span>
                </div>
            </div>
            <div className="p-4 text-sm text-slate-300">
                {children}
            </div>
        </div>
    );
};
export default Terminal;
