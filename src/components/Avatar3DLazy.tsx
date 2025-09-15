import React, { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Lazy load the 3D component to avoid impacting initial bundle
const Avatar3DCanvas = lazy(() => import("./Avatar3DCanvas"));

// Animated fallback component
function Avatar3DFallback() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="relative aspect-square w-full max-w-[320px] rounded-2xl p-[2px] neon-ring">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/60 to-fuchsia-500/60 blur-2xl" />
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-2 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    {/* Animated geometric shapes as fallback */}
                    <div className="relative w-32 h-32">
                        {/* Main shape */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-80"
                            animate={prefersReducedMotion ? {} : {
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Orbiting elements */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 bg-white/60 rounded-full"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                    transformOrigin: `${40 + i * 10}px 0px`,
                                }}
                                animate={prefersReducedMotion ? {} : {
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: i * 0.5,
                                }}
                            />
                        ))}

                        {/* Pulse effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white/30"
                            animate={prefersReducedMotion ? {} : {
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                        />
                    </div>
                </div>

                {/* Loading text */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <motion.p
                        className="text-xs text-white/60 font-medium"
                        animate={prefersReducedMotion ? {} : {
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        Carregando experiência 3D...
                    </motion.p>
                </div>
            </div>
        </div>
    );
}

// Error fallback component
function Avatar3DError() {
    return (
        <div className="relative aspect-square w-full max-w-[320px] rounded-2xl p-[2px] border border-border">
            <div className="relative rounded-2xl bg-gradient-to-b from-background to-muted p-2">
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white">JF</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Avatar 3D indisponível
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Usando fallback 2D
                    </p>
                </div>
            </div>
        </div>
    );
}

interface Avatar3DLazyProps {
    className?: string;
    enableLazyLoad?: boolean;
}

export default function Avatar3DLazy({
    className = "",
    enableLazyLoad = true
}: Avatar3DLazyProps) {
    const [shouldLoad, setShouldLoad] = useState(!enableLazyLoad);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!enableLazyLoad) return;

        // Load 3D component after a delay to not block initial render
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [enableLazyLoad]);

    // Handle intersection observer for lazy loading
    useEffect(() => {
        if (!enableLazyLoad || shouldLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoad(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('avatar-3d-container');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, [enableLazyLoad, shouldLoad]);

    if (hasError) {
        return <Avatar3DError />;
    }

    return (
        <div id="avatar-3d-container" className={className}>
            {shouldLoad ? (
                <Suspense fallback={<Avatar3DFallback />}>
                    <ErrorBoundary onError={() => setHasError(true)}>
                        <Avatar3DCanvas />
                    </ErrorBoundary>
                </Suspense>
            ) : (
                <Avatar3DFallback />
            )}
        </div>
    );
}

// Simple error boundary component
interface ErrorBoundaryProps {
    children: React.ReactNode;
    onError: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Avatar3D Error:', error, errorInfo);
        this.props.onError();
    }

    render() {
        if (this.state.hasError) {
            return null; // Let parent handle error display
        }

        return this.props.children;
    }
}