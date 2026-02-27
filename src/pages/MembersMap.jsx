import TrackMap from '../components/ui/TrackMap';
import { motion } from 'framer-motion';

const MembersMap = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold cncf-gradient-text"
                >
                    Community Footprint
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 max-w-2xl mx-auto text-sm"
                >
                    Visualizing the footprint of DevSecOps professionals across Pakistan.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full glass-panel overflow-hidden"
            >
                <div className="bg-[#050505]/80 px-4 py-3 border-b border-white/5 flex items-center justify-center">
                    <span className="font-semibold text-sm text-slate-300">Live Member Map</span>
                </div>
                <div className="p-4 bg-[#0a0a0a]/90 min-h-[500px] flex items-center justify-center relative">
                    {/* The Map Component */}
                    <TrackMap />

                    {/* Glowing effect behind map */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default MembersMap;
