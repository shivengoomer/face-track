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
    <div className="text-center ">
      <h1 className="text-5xl font-bold mb-15">Face Tracking Recorder</h1>
   <div className="flex w-full gap-2 max-w-screen">
  <div className={`flex flex-col items-center justify-center gap-6 p-6 transition-all duration-300 ${recordedVideo ? "w-3/4" : "w-full"}`}>

    <div className="relative w-full max-w-[650px] h-[480px] bg-black rounded-lg">
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="w-full h-full rounded-4xl" />
    </div>

    {/* Recording Controls */}
    <div className="flex gap-4">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-4  text-2xl py-2 bg-green-600 text-white  hover:bg-green-700 rounded-3xl"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4  text-2xl py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700"
        >
          Stop Recording
        </button>
      )}
    </div>
  </div>

  {/* Right Section - Recorded Video */}
  {recordedVideo && (
    <div className="flex-grow p-4 transition-all duration-300">
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <h2 className="text-3xl font-semibold mb-2">Recorded Video</h2>
        <video src={recordedVideo} controls className="w-full rounded-lg mb-2" />
        <button
          onClick={downloadVideo}
          className="px-4  text-2xl py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Video
        </button>
      </div>
    </div>
  )}
</div>

    </div>
    


  )};
