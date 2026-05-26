"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticWrapperProps = {
    children: ReactNode;
    className?: string;
    strength?: number;
};

export default function MagneticWrapper({ children, className, strength = 0.24 }: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.35 });
    const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.35 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;

        const nextX = (event.clientX - bounds.left - bounds.width / 2) * strength;
        const nextY = (event.clientY - bounds.top - bounds.height / 2) * strength;
        x.set(nextX);
        y.set(nextY);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
        >
            {children}
        </motion.div>
    );
}
