'use client'

import React, { useEffect, useRef } from 'react';
import { Heart, Shield, Bell, Activity, LineChart, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { getUser } from '../login/actions';
import Link from 'next/link';

function LandingPage() {
    const router = useRouter()

    const pathname = usePathname();  // Get the current path

    useEffect(() => {

        async function obtainUser() {
            const user = await getUser();

            // Redirect based on login state
            if (user.data.user && pathname === "/") {
                // If logged in and currently on login page, redirect to dashboard
                router.push("/systeminfo");
            }
        }

        obtainUser();

    }, [router, pathname]);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof window === 'undefined') return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = [];

        const getWindowWidth = () => {
            return typeof window !== 'undefined' ? window.innerWidth : 1024;
        };

        const initParticles = () => {
            if (!canvas) return;

            const isMobile = getWindowWidth() < 768;
            const particleCount = isMobile ? 30 : 100;
            particles = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: isMobile ? Math.random() * 2 + 1 : Math.random() * 3 + 2,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
            }
        };

        const handleResize = () => {
            if (!canvas || typeof window === 'undefined') return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const animate = () => {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();

                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const isMobile = getWindowWidth() < 768;
                    const maxDistance = isMobile ? 100 : 150;

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / maxDistance)})`;
                        ctx.lineWidth = isMobile ? 1 : 1.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        animate();

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 relative overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
            />

            {/* Hero Section */}
            <header className="relative">
                <nav className="sticky top-0 z-50 bg-blue-600/95 backdrop-blur-md shadow-lg border-b border-blue-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white rounded-full p-2 shadow-lg">
                                    <Heart className="w-6 h-6 text-blue-600 animate-pulse" />
                                </div>
                                <span className="text-2xl font-bold text-white">
                                    ElderCare
                                </span>
                            </div>
                            <div className="flex space-x-3">
                                <Link href={'/login'}>
                                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                        Login
                                    </button>
                                </Link>
                                
                                <Link href={'/signup'}>
                                    <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400">
                                        Sign Up
                                    </button>
                                </Link>
                                {/* <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400">
                                    Register
                                </button> */}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 [animation:fadeIn_1.2s_cubic-bezier(0.4,0,0.2,1)] drop-shadow-lg">
                            Empowering Elderly Care
                            <span className="block text-blue-700">Through Technology</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto [animation:fadeIn_1.2s_cubic-bezier(0.4,0,0.2,1)_0.5s_both]">
                            Comprehensive monitoring and support system for caregivers and healthcare providers to ensure the best care for elderly individuals.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 [animation:fadeIn_1.2s_cubic-bezier(0.4,0,0.2,1)_0.5s_both]">
                            <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl">
                                Get Started
                            </button>
                            <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 drop-shadow-lg">
                        Comprehensive Care Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: 'Real-time Monitoring', desc: 'Track vital health metrics and activities with advanced monitoring systems.' },
                            { icon: Bell, title: 'Emergency Alerts', desc: 'Instant notifications for critical health events and emergencies.' },
                            { icon: Activity, title: 'Activity Tracking', desc: 'Detailed logs of daily activities and health patterns.' },
                            { icon: LineChart, title: 'Health Analytics', desc: 'Comprehensive reports and insights for better care decisions.' },
                            { icon: Users, title: 'Family Connection', desc: 'Keep family members informed and involved in care decisions.' },
                            { icon: Heart, title: 'Quality Care', desc: 'Enhanced care quality through data-driven insights.' }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-2 hover:bg-gradient-to-b hover:from-white hover:to-blue-50"
                            >
                                <feature.icon className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-base md:text-lg text-gray-700">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -skew-y-6 shadow-2xl"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">Ready to Enhance Elderly Care?</h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of caregivers who are already providing better care with our platform.
                    </p>
                    <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                        Start Free Trial
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-12 relative text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Heart className="w-6 h-6 text-blue-400" />
                            <span className="text-lg font-semibold text-blue-400">ElderCare</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About</a>
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Features</a>
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact</a>
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Privacy</a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-400">
                        &copy; {new Date().getFullYear()} ElderCare. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;

























// 'use client'

// import React, { useEffect, useRef } from 'react';
// import { Heart, Shield, Bell, Activity, LineChart, Users } from 'lucide-react';

// function App() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let animationFrameId: number;
//     let particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = [];

//     const initParticles = () => {
//       const particleCount = window.innerWidth < 768 ? 30 : 100;
//       particles = [];

//       for (let i = 0; i < particleCount; i++) {
//         particles.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           radius: window.innerWidth < 768 ? Math.random() * 2 + 1 : Math.random() * 3 + 2,
//           vx: (Math.random() - 0.5) * 0.5,
//           vy: (Math.random() - 0.5) * 0.5
//         });
//       }
//     };

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       initParticles();
//     };

//     handleResize();

//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';

//       particles.forEach(particle => {
//         particle.x += particle.vx;
//         particle.y += particle.vy;

//         if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
//         if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
//         ctx.fill();

//         particles.forEach(otherParticle => {
//           const dx = particle.x - otherParticle.x;
//           const dy = particle.y - otherParticle.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           const maxDistance = window.innerWidth < 768 ? 100 : 150;

//           if (distance < maxDistance) {
//             ctx.beginPath();
//             ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / maxDistance)})`;
//             ctx.lineWidth = window.innerWidth < 768 ? 1 : 1.5;
//             ctx.moveTo(particle.x, particle.y);
//             ctx.lineTo(otherParticle.x, otherParticle.y);
//             ctx.stroke();
//           }
//         });
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     }

//     animate();

//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 relative overflow-hidden">
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
//       />

//       {/* Hero Section */}
//       <header className="relative">
//         <nav className="sticky top-0 z-50 bg-blue-600/95 backdrop-blur-md shadow-lg border-b border-blue-500">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-white rounded-full p-2 shadow-lg">
//                   <Heart className="w-6 h-6 text-blue-600 animate-pulse" />
//                 </div>
//                 <span className="text-2xl font-bold text-white">
//                   ElderCare
//                 </span>
//               </div>
//               <div className="flex space-x-3">
//                 <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
//                   Login
//                 </button>
//                 <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400">
//                   Register
//                 </button>
//               </div>
//             </div>
//           </div>
//         </nav>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 [animation:fadeIn_1.2s_cubic-bezier(0.4,0,0.2,1)] drop-shadow-lg">
//               Empowering Elderly Care
//               <span className="block text-blue-700">Through Technology</span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto [animation:fadeIn_1.2s_cubic-bezier(0.4,0,0.2,1)_0.5s_both]">
//               Comprehensive monitoring and support system for caregivers and healthcare providers to ensure the best care for elderly individuals.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 [animation:fadeIn_1.2s_cubic-bezier(0.4,0,0.2,1)_0.5s_both]">
//               <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl">
//                 Get Started
//               </button>
//               <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl">
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Features Section */}
//       <section className="py-20 relative">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 drop-shadow-lg">
//             Comprehensive Care Features
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               { icon: Shield, title: 'Real-time Monitoring', desc: 'Track vital health metrics and activities with advanced monitoring systems.' },
//               { icon: Bell, title: 'Emergency Alerts', desc: 'Instant notifications for critical health events and emergencies.' },
//               { icon: Activity, title: 'Activity Tracking', desc: 'Detailed logs of daily activities and health patterns.' },
//               { icon: LineChart, title: 'Health Analytics', desc: 'Comprehensive reports and insights for better care decisions.' },
//               { icon: Users, title: 'Family Connection', desc: 'Keep family members informed and involved in care decisions.' },
//               { icon: Heart, title: 'Quality Care', desc: 'Enhanced care quality through data-driven insights.' }
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className="group p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-2 hover:bg-gradient-to-b hover:from-white hover:to-blue-50"
//               >
//                 <feature.icon className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
//                 <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
//                 <p className="text-base md:text-lg text-gray-700">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative py-20 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -skew-y-6 shadow-2xl"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">Ready to Enhance Elderly Care?</h2>
//           <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
//             Join thousands of caregivers who are already providing better care with our platform.
//           </p>
//           <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
//             Start Free Trial
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 py-12 relative text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <Heart className="w-6 h-6 text-blue-400" />
//               <span className="text-lg font-semibold text-blue-400">ElderCare</span>
//             </div>
//             <div className="flex flex-wrap justify-center gap-6">
//               <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About</a>
//               <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Features</a>
//               <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact</a>
//               <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Privacy</a>
//             </div>
//           </div>
//           <div className="mt-8 text-center text-gray-400">
//             © 2024 ElderCare. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;