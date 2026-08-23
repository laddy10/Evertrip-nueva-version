"use client";

import Image from "next/image";

interface SplitImageCardProps {
  /** Left image — origin city */
  src1: string;
  /** Right image — destination city */
  src2: string;
  alt: string;
}

export default function SplitImageCard({ src1, src2, alt }: SplitImageCardProps) {
  return (
    <div className="absolute inset-0 flex overflow-hidden select-none pointer-events-none rounded-[inherit]">
      {/* Left side (50%) */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <Image
          src={src1}
          alt={alt + " – origen"}
          fill
          className="object-cover"
          draggable={false}
          priority
        />
      </div>

      {/* Right side (50%) */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <Image
          src={src2}
          alt={alt + " – destino"}
          fill
          className="object-cover"
          draggable={false}
          priority
        />
      </div>

      {/* Static Divider line */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/40 shadow-[0_0_8px_rgba(0,0,0,0.5)] z-10" />
    </div>
  );
}
