"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MoveUpRight, Zap, Play, Check, TrendingUp, Shield, BarChart3, Wallet } from 'lucide-react';

export default function LandingPageRoute() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    return (
        <div className="bg-background min-h-screen font-jost text-black overflow-x-hidden selection:bg-lime-400 selection:text-black">

            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
                <div className="flex items-center">
                    <span className="font-austrisa text-6xl bg-gradient-to-br from-black from-[15%] via-black/80 to-lime-500 to-[85%] bg-clip-text text-transparent inline-block px-4 py-3 leading-normal translate-y-2">AV</span>
                </div>

                <div className="hidden md:flex items-center gap-8 bg-gray-100/50 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200/50 shadow-sm">
                    {['Marketplace', 'Features', 'Pricing', 'About'].map((item) => (
                        <a key={item} href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button onClick={handleLogin} className="hidden sm:block text-sm font-semibold px-4 py-2 hover:bg-gray-200 rounded-full transition-colors">
                        Log in
                    </button>
                    <button onClick={handleSignup} className="text-sm font-bold bg-black text-white px-6 py-3 rounded-full hover:bg-lime-400 hover:text-black hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl shadow-lime-400/20">
                        Sign up
                        <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-12 pb-32 overflow-hidden">
                {/* Abstract Background Blobs */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lime-400 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-[100px] opacity-60 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Content */}
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 shadow-sm">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-wide uppercase text-gray-600">P2P Ad Market v2.0</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-moralana tracking-tight leading-[1.1] text-black">
                                Influence <br />
                                <span className="inline-flex items-center gap-4">
                                    <Zap size={48} className="text-lime-500 fill-lime-500/20" />
                                    Amplified
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                                The heartbeat of Ethiopia's creator economy. Whether you're a brand scaling fast or a creator building your legacy—we bridge the gap.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button onClick={handleSignup} className="h-14 px-8 rounded-full bg-lime-400 text-black font-bold text-lg hover:bg-lime-300 transition-colors flex items-center gap-2 shadow-lg shadow-lime-400/30 transform hover:-translate-y-1">
                                    Start Earning
                                    <MoveUpRight size={20} />
                                </button>
                                <button className="h-14 px-8 rounded-full bg-gray-100 text-black border border-gray-200 font-bold text-lg hover:border-gray-400 transition-colors flex items-center gap-2">
                                    <Play size={20} className="fill-black" />
                                    Watch Demo
                                </button>
                            </div>

                            <div className="pt-8 flex items-center gap-4 text-sm font-medium text-gray-600">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} src={`https://picsum.photos/40/40?random=${i}`} className="w-10 h-10 rounded-full border-2 border-gray-100" alt="User" />
                                    ))}
                                </div>
                                <p>Trusted by 500+ top creators</p>
                            </div>
                        </div>

                        {/* Right: Floating UI Composition */}
                        <div className="relative h-[600px] hidden lg:block perspective-1000">
                            <div className="absolute top-10 left-10 w-80 bg-gray-50 rounded-[2.5rem] p-6 shadow-2xl shadow-gray-200 border border-gray-100 rotate-[-6deg] animate-float z-20">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-gray-400 text-xs font-semibold uppercase">Total Earnings</p>
                                        <h3 className="text-3xl font-bold text-black">ETB 45.2k</h3>
                                    </div>
                                    <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                                <div className="h-32 flex items-end gap-2 mb-6">
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-lime-400' : 'bg-gray-200'}`}></div>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-black text-gray-100 rounded-2xl text-xs font-bold">Withdraw</button>
                                    <button className="flex-1 py-3 bg-gray-200 text-black rounded-2xl text-xs font-bold">Add Funds</button>
                                </div>
                            </div>

                            <div className="absolute top-32 right-10 w-72 bg-gray-900 rounded-[2rem] p-5 shadow-2xl shadow-black/20 rotate-[6deg] animate-float-delayed z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-gray-100 font-bold">Active Offers</h4>
                                    <span className="bg-lime-400 text-black text-[10px] font-bold px-2 py-1 rounded-md">LIVE</span>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-800/30 p-3 rounded-2xl border border-gray-800">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lime-400 to-blue-500"></div>
                                            <div className="flex-1">
                                                <div className="h-2 w-20 bg-gray-700 rounded mb-1.5"></div>
                                                <div className="h-2 w-12 bg-gray-800 rounded"></div>
                                            </div>
                                            <div className="text-lime-400 font-bold text-xs">Bid</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-20 right-40 w-32 h-32 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bento Grid Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-16 md:flex justify-between items-end">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-black max-w-xl leading-tight">
                        Built for Both Sides <br /> of the Feed
                    </h2>
                    <p className="text-gray-500 max-w-xs mt-4 md:mt-0">
                        From finding your first brand deal to managing million-birr campaigns.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                    <div className="md:col-span-2 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="relative z-10 max-w-sm">
                            <h3 className="text-3xl font-bold mb-4">Monetize Your Audience</h3>
                            <p className="text-gray-600 mb-8">Creators: Browse exclusive sponsorships from top Ethiopian brands.<br /> Brands: Filter by niche, reach, and performance score.</p>
                            <button onClick={handleSignup} className="flex items-center gap-2 font-bold text-black group-hover:gap-4 transition-all">
                                Explore Marketplace <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-lime-100 rounded-full mix-blend-multiply filter blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute top-10 right-10 w-40 h-40 border-[16px] border-lime-400/20 rounded-full animate-spin-slow"></div>
                    </div>

                    <div className="md:col-span-1 bg-gray-900 rounded-[2.5rem] p-8 text-gray-100 relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                                <BarChart3 className="text-lime-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Creator Hub</h3>
                                <p className="text-gray-400 text-sm mb-6">Track your engagement rate, average ROI per post, and follower growth trends.</p>
                                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-lime-400"></div>
                                </div>
                            </div>
                        </div>
                        <svg className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 30 50 70 50 100 0" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-100" />
                        </svg>
                    </div>

                    <div className="md:col-span-1 bg-lime-400 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Smart Escrow</h3>
                        <p className="text-black/70 text-sm mb-6 relative z-10">Creators get paid instantly upon brand approval. Your funds are always secure.</p>
                        <div className="absolute bottom-4 right-4 bg-black/5 backdrop-blur-sm p-3 rounded-2xl">
                            <Wallet size={32} className="text-black" />
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold mb-2">Verified Professionalism</h3>
                            <p className="text-gray-600">Our trust score system rewards reliable creators and brands, building the safest community in the region.</p>
                        </div>
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shield size={32} className="text-black" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners / Social Proof */}
            <div className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-2xl font-bold text-center text-black mb-12">Our Partners</h3>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Telebirr', 'Chapa', 'Commercial Bank', 'Ride', 'Safaricom'].map((partner) => (
                            <div key={partner} className="text-xl font-bold font-mono uppercase tracking-widest text-black">{partner}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-900 text-gray-100 py-24 rounded-t-[3rem] mx-2 mt-10 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        Get the App for Free <br /> and <span className="text-lime-400">Start Now</span>
                    </h2>
                    <div className="flex justify-center gap-4">
                        <button onClick={handleSignup} className="bg-gray-100 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-400 hover:scale-105 transition-all duration-300">
                            Join Marketplace
                        </button>
                    </div>
                </div>
                <svg className="absolute top-1/2 left-0 w-full h-64 -translate-y-1/2 opacity-10 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 10 Q 25 20 50 10 T 100 10" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gray-100" />
                </svg>
            </div>

        </div>
    );
}
