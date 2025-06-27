
import React, { useEffect, useMemo } from 'react';

// Since we are using CDN, we need to declare tsParticles
declare global {
    interface Window {
        tsParticles: any;
    }
}

const ParticlesBackground: React.FC = () => {
    const particlesConfig = useMemo(() => ({
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
                repulse: {
                    distance: 60,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#33E0E0",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 80,
            },
            opacity: {
                value: 0.2,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
    }), []);

    useEffect(() => {
        if (window.tsParticles) {
            window.tsParticles.load({ id: "tsparticles", options: particlesConfig });
        }
    }, [particlesConfig]);

    return <div id="tsparticles" className="absolute top-0 left-0 w-full h-full" />;
};

export default ParticlesBackground;
