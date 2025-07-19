"use client";

import React, { useEffect, useRef } from "react";
import { WavyBackground } from "../components/background";
export default function FaceDetection() {
  const videoRef = useRef(null);

  // Start camera when component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-[640px] h-[480px] object-cover rounded-lg transform scale-x-[-1]"
        />
      </div>
    </div>
  );
}
