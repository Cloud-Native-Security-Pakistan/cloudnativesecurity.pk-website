import { Download, Copy, Check } from 'lucide-react';
import CyberCard from '../components/ui/CyberCard';
import { useState } from 'react';

const BrandPage = () => {
    const [copied, setCopied] = useState(false);

    // Function to copy hex code
    const copyColor = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopied(hex);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    Brand_Assets
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Official graphical interface guidelines and binary assets for Cloud Native Security Pakistan.
                </p>
                <div className="pt-4">
                    <a
                        href="/cnsp-brand-assets.zip"
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    >
                        <Download size={20} />
                        Download Full Kit (ZIP)
                    </a>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <CyberCard className="flex flex-col items-center justify-center min-h-[300px]">
                    <img src="/brand/CNSP%20Logo%20Black.png" alt="CNSP Logo" className="w-48 h-auto opacity-90" />
                    <p className="mt-4 text-slate-500 font-mono text-sm">Primary Shield Lockup</p>
                </CyberCard>

                <CyberCard className="flex flex-col items-center justify-center min-h-[300px]">
                    <img src="/brand/Color%20Logo%20with%20Text%20(Short%20Form).png" alt="CNSP Wordmark" className="w-64 h-auto opacity-90" />
                    <p className="mt-4 text-slate-500 font-mono text-sm">Horizontal Lockup</p>
                </CyberCard>
            </div>

            <h2 className="text-2xl font-mono text-slate-200 mb-8 px-2">&gt; System_Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                    { name: 'Pure Black', hex: '#000000' },
                    { name: 'CNSP Blue', hex: '#00A2FF' },
                    { name: 'Deep Navy', hex: '#0D1117' },
                    { name: 'Night', hex: '#161B22' }
                ].map(color => (
                    <div key={color.hex} className="group relative" onClick={() => copyColor(color.hex)}>
                        <div className="h-24 rounded-lg mb-2 border border-slate-800 transition-transform group-hover:scale-105 cursor-pointer" style={{ backgroundColor: color.hex }}></div>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-sm font-mono text-slate-400">{color.name}</span>
                            <span className="text-xs text-slate-600 group-hover:text-cyan-400 font-mono">{copied === color.hex ? <Check size={12} /> : color.hex}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default BrandPage;
