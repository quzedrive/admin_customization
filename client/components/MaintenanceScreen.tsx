import React from 'react';
import { Wrench, Mail } from 'lucide-react';

interface MaintenanceScreenProps {
    title?: string;
    message?: string;
    siteTitle?: string;
    email?: string;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
    title = "We're Making Things Better",
    message = "Our site is currently undergoing scheduled maintenance to bring you an improved experience. We'll be back online shortly.",
    siteTitle = "YourBrand",
    email = "support@yourbrand.com"
}) => {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Simple Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Main content */}
            <div className="relative z-10 max-w-lg w-full">
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border border-white/10 p-8 text-center">
                    {/* Animated icon */}
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Wrench className="w-8 h-8 text-purple-300" style={{ animation: 'spin-slow 4s linear infinite' }} />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {title}
                    </h1>

                    {/* Message */}
                    <p className="text-gray-400 text-base leading-relaxed mb-8">
                        {message}
                    </p>

                    {/* Contact & Footer */}
                    <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                        <a
                            href={`mailto:${email}`}
                            className="inline-flex items-center justify-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition-colors"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{email}</span>
                        </a>

                        <p className="text-gray-600 text-xs">
                            © {new Date().getFullYear()} {siteTitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceScreen;