"use client";

import { ReactNode, useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type TiltCardProps = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    maxTilt?: number;
};

export default function TiltCard({ children, className, style, maxTilt = 8 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [maxTilt, -maxTilt]), { stiffness: 220, damping: 24 });
    const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-maxTilt, maxTilt]), { stiffness: 220, damping: 24 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;

        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    };

    const reset = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            style={{ ...style, rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
