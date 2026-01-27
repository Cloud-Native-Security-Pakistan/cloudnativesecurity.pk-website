import { ArrowRight, Code, Shield, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import Terminal from '../components/ui/Terminal';
import CyberCard from '../components/ui/CyberCard';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-3 py-1 mb-6 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            v2.0.0 Online
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
                            Securing the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Cloud Native</span>
                            <br /> Future.
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                            We are Pakistan's largest community of cloud native security professionals.
                            Building the next generation of DevSecOps engineers.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="https://github.com/cloud-native-security-pakistan" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Join the Force
                            </a>
                            <Link to="/brand" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors">
                                View Brand Kit
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <Terminal title="init_sequence.sh">
                            <div className="space-y-2">
                                <p className="text-green-400">$ initializing_protocol</p>
                                <p className="text-slate-400">&gt; Loading modules...</p>
                                <p className="text-slate-400">&gt; Connecting to Kubernetes clusters...</p>
                                <p className="text-slate-400">&gt; Verifying security policies...</p>
                                <p className="text-cyan-400 font-bold">&gt; ACCESS GRANTED</p>
                                <p className="text-slate-500 animate-pulse">_</p>
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
