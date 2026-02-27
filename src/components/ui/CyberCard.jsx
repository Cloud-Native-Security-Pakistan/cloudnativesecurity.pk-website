import { motion } from 'framer-motion';

const CyberCard = ({ children, className = "" }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative p-6 bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-xl overflow-hidden group ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
export default CyberCard;
