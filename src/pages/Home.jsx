import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Globe2, BookOpen } from 'lucide-react';
import CyberCard from '../components/ui/CyberCard';

const Home = () => {
    return (
        <div className="relative">
            {/* Background elements matching legacy_v1 */}
            <div className="hero-orb w-[800px] h-[800px] top-[-20%] left-[-10%] animate-pulse-slow"></div>
            <div className="hero-orb w-[600px] h-[600px] bottom-[-10%] right-[-5%] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="container mx-auto px-6 relative z-10 text-center">

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 hover:border-brand-500/50 transition-colors"
                    >
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        <span className="text-sm font-mono text-gray-300">The 1st CNCF Security Chapter in Pakistan</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-none text-white text-glow"
                    >
                        Secure the <br className="hidden md:block" />
                        <span className="cncf-gradient-text">Cloud Native</span> Future
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Join Pakistan's premier community for cloud security professionals, developers, students, and CXOs building secure cloud-native systems together.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-4 justify-center items-center"
                    >
                        <a href="https://github.com/cloud-native-security-pakistan" className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            <span>Become a Member</span>
                        </a>
                        <a href="/events" className="px-8 py-4 glass-panel hover:bg-white/5 text-gray-200 rounded-lg font-semibold transition-all hover:border-brand-500/50 flex items-center gap-3">
                            <BookOpen className="w-5 h-5" />
                            <span>Explore Events</span>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section matching legacy_v1 */}
            <section className="border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <div className="text-4xl font-bold text-white mb-2 font-mono">250+</div>
                            <div className="text-gray-500 text-sm uppercase tracking-wider">Members</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <div className="text-4xl font-bold text-white mb-2 font-mono">12+</div>
                            <div className="text-gray-500 text-sm uppercase tracking-wider">Events Hosted</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="text-4xl font-bold text-white mb-2 font-mono">3</div>
                            <div className="text-gray-500 text-sm uppercase tracking-wider">Major Cities</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <div className="text-4xl font-bold text-white mb-2 font-mono">100%</div>
                            <div className="text-gray-500 text-sm uppercase tracking-wider">Community Driven</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Extended Feature Highlights (Friendly for all) */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">A Space for <span className="text-brand-500 text-glow">Everyone</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">From students writing their first manifest to CXOs securing enterprise clusters.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <CyberCard title="Learn & Connect" delay={0.1} icon={<Users className="w-6 h-6 text-brand-500" />}>
                            Join study groups, attend local meetups, and connect with mentors across Pakistan. Perfect for students and juniors.
                        </CyberCard>

                        <CyberCard title="Share Expertise" delay={0.2} icon={<Shield className="w-6 h-6 text-brand-500" />}>
                            Speak at events, contribute to open-source security tools, and map the threat landscape. Ideal for senior engineers and architects.
                        </CyberCard>

                        <CyberCard title="Global Footprint" delay={0.3} icon={<Globe2 className="w-6 h-6 text-brand-500" />}>
                            Be part of the global Cloud Native Computing Foundation ecosystem and put Pakistan's security talent on the map.
                        </CyberCard>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
