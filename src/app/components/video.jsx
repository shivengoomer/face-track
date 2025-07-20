"use client";
import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { detectFaces } from "../utils/faceDetect";
import { startCamera } from "../utils/camera";

export default function Video() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);

  const recorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Load models
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    ]);
    setModelsLoaded(true);
    startCamera(videoRef);
  };

  // Start recording (Canvas includes video+overlay)
  const startRecording = () => {
    recordedChunks.current = [];
    const stream = canvasRef.current.captureStream(30); // Capture canvas stream
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const downloadVideo = () => {
    if (!recordedVideo) return;
    const a = document.createElement("a");
    a.href = recordedVideo;
    a.download = "face-tracking-video.webm";
    a.click();
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;
    const onVideoPlay = () => {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      detectFaces(videoRef, canvasRef);
    };
    videoRef.current?.addEventListener("loadeddata", onVideoPlay);
    return () => videoRef.current?.removeEventListener("loadeddata", onVideoPlay);
  }, [modelsLoaded]);
return (
  <div className="text-center px-4 py-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen text-white">
  <h1 className="text-5xl sm:text-6xl md:text-7xl pt-5 mb-10 font-extrabold text-transparent bg-clip-text 
                 bg-gradient-to-r from-black via-white to-gray-600
                 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]
                 animate-fade-in">
    Track with Webcam
  </h1>

  {/* Container */}
  <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-10 max-w-screen-lg mx-auto items-center justify-between">
    
    <div
      className={`flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 
                  backdrop-blur-md bg-white/5 rounded-xl shadow-lg
                  transition-all duration-300 ${recordedVideo ? "lg:w-3/4 w-full" : "w-full"}`}
    >
      <div className="relative w-full max-w-[90vw] sm:max-w-[650px] h-[240px] sm:h-[400px] lg:h-[480px] 
                      bg-gradient-to-tr from-gray-800 to-gray-700 rounded-xl overflow-hidden 
                      flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]">
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
        <canvas ref={canvasRef} className="w-full h-full rounded-xl" />
      </div>

      <div className="flex gap-4 sm:gap-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-5 sm:px-6 text-lg sm:text-2xl py-2 sm:py-3 rounded-3xl font-semibold
                       bg-gradient-to-r from-green-500 to-green-600 text-white 
                       shadow-[0_0_10px_rgba(16,185,129,0.5)]
                       hover:from-green-400 hover:to-green-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.7)]
                       transition-all duration-300"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-5 sm:px-6 text-lg sm:text-2xl py-2 sm:py-3 rounded-3xl font-semibold
                       bg-gradient-to-r from-red-500 to-red-600 text-white 
                       shadow-[0_0_10px_rgba(239,68,68,0.5)]
                       hover:from-red-400 hover:to-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]
                       transition-all duration-300"
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>

    {recordedVideo && (
      <div className="flex-grow p-4 sm:p-6 backdrop-blur-md bg-white/5 rounded-xl shadow-lg 
                      lg:w-1/3 w-full transition-all duration-300">
        <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2">
            Recorded Video
          </h2>
          <video
            src={recordedVideo}
            controls
            className="w-full rounded-xl shadow-md border border-white/10"
          />
          <button
            onClick={downloadVideo}
            className="px-5 sm:px-6 text-lg sm:text-2xl py-2 sm:py-3 rounded-3xl font-semibold
                       bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                       shadow-[0_0_10px_rgba(59,130,246,0.5)]
                       hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]
                       transition-all duration-300"
          >
            Download Video
          </button>
        </div>
      </div>
    )}
  </div>
</div>

);
}
