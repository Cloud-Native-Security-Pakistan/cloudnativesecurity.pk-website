import { ArrowRight, Code, Shield, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import Terminal from '../components/ui/Terminal';
import CyberCard from '../components/ui/CyberCard';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">

                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff15_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff15_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-transparent blur-2xl -z-10 rounded-full"></div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            v2.0.0 Mainframe Online
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-tight flex flex-col">
                            <span>Securing the</span>
                            <span className="cyber-gradient-text drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Cloud Native</span>
                            <span>Future.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300/80 mb-10 max-w-xl leading-relaxed font-light border-l-2 border-cyan-500/50 pl-4 bg-gradient-to-r from-cyan-500/5 to-transparent py-2">
                            Pakistan's largest force of cloud native security professionals. Building the next generation of <span className="text-cyan-400 font-mono text-sm tracking-widest bg-cyan-500/10 px-1 rounded">DEV_SEC_OPS</span> engineers.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <a href="https://github.com/cloud-native-security-pakistan" className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center gap-3 overflow-hidden">
                                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                                <Shield className="w-5 h-5 relative z-10" />
                                <span className="relative z-10 font-mono uppercase tracking-wider text-sm">Join the Force</span>
                            </a>
                            <Link to="/brand" className="group px-8 py-4 bg-[#0a1122] hover:bg-slate-800 text-cyan-400 font-mono text-sm uppercase tracking-wider rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                View_Brand_Kit
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="relative lg:ml-auto w-full max-w-lg"
                    >
                        {/* Decorative background for terminal */}
                        <div className="absolute inset-0 bg-cyan-500/5 border border-cyan-500/20 translate-x-4 translate-y-4 rounded-lg -z-10 blur-sm"></div>
                        <Terminal title="root@cnsp:~# init_sequence.sh">
                            <div className="space-y-3 font-mono text-sm">
                                <p className="text-emerald-400 flex gap-2"><span>$</span> <span className="typing-animation">initializing_protocol --force</span></p>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                                    <p className="text-slate-400">&gt; Loading DevSecOps modules [OK]</p>
                                    <p className="text-slate-400">&gt; Securing K8s clusters [OK]</p>
                                    <p className="text-slate-400">&gt; Injecting zero-trust policies [OK]</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                                    <p className="text-cyan-400 mt-2">Connecting to CNSP network...</p>
                                    <div className="w-full bg-slate-800 h-1 mt-1 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ delay: 2, duration: 1.5 }} className="h-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]"></motion.div>
                                    </div>
                                </motion.div>
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} className="text-emerald-400 font-bold mt-4 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">&gt; ACCESS GRANTED</motion.p>
                                <p className="text-slate-500 animate-pulse mt-2">_</p>
                            </div>
                        </Terminal>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Code, title: "Open Source", desc: "Contributing to CNCF projects and building local tools." },
                        { icon: Network, title: "Community Driven", desc: "A network of 500+ security engineers and students." },
                        { icon: Shield, title: "Security First", desc: "Promoting best practices in DevSecOps and Cloud Security." }
                    ].map((feature, idx) => (
                        <CyberCard key={idx}>
                            <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </CyberCard>
                    ))}
                </div>
            </section>
        </div>
    );
};
export default Home;
