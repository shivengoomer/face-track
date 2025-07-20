import { HeroGeometric } from "./components/background";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      {/* Fixed Top Button */}
      <div className=" bg-none fixed top-5 left-0 w-full flex justify-center py-4 z-50 bg-gradient-to-r from-[#1a1a1a] via-[#2d0b4e] to-[#1a1a1a] shadow-md">
        <Link href="/test">
          <button
            className="relative px-8 py-3 rounded-3xl 
            bg-gradient-to-b from-[#8B5CF6]/70 via-[#7C3AED]/70 to-[#5B21B6]/70
            text-white font-semibold text-lg 
            shadow-[0_4px_20px_rgba(139,92,246,0.3)] 
            backdrop-blur-sm border border-white/10
            hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] 
            hover:from-[#9D6BFF]/90 hover:to-[#6C3AFF]/90
            transition-all duration-300 ease-in-out"

          >
            Webcam Test
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <HeroGeometric
        title1="Track and Record!"
        title2="Capture Every Move with Precision."
        badge="Made by Shiven"
      />
    </main>
  );
}
