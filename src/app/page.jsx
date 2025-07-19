import { WavyBackground } from "./components/background";
import WebcamFeed from "./components/video";

export default function Home() {
  return (
    <main className="w-full h-screen">
      <WavyBackground containerClassName="w-full h-full flex items-center justify-center">
        <WebcamFeed />
      </WavyBackground>
    </main>
  );
}
