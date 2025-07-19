"use client";
import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { startCamera } from "../utils/camera";
import { detectFaces } from "../utils/faceDetect";
import {
  saveVideoToLocalStorage,
  loadVideoFromLocalStorage,
  clearVideoFromLocalStorage,
} from "../utils/videoStorage";

export default function Video() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderCanvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedURL, setRecordedURL] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
      startCamera(videoRef);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded || !videoRef.current) return;
    const startDetection = () => {
      const { videoWidth, videoHeight } = videoRef.current;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      recorderCanvasRef.current.width = videoWidth;
      recorderCanvasRef.current.height = videoHeight;
      detectFaces(videoRef, canvasRef, recorderCanvasRef);
    };
    videoRef.current.addEventListener("loadedmetadata", startDetection);
    return () =>
      videoRef.current?.removeEventListener("loadedmetadata", startDetection);
  }, [modelsLoaded]);

  const startRecording = () => {
    const stream = recorderCanvasRef.current.captureStream(30);
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
    recordedChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      await saveVideoToLocalStorage(blob);
      const savedVideo = loadVideoFromLocalStorage();
      setRecordedURL(savedVideo);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    const savedVideo = loadVideoFromLocalStorage();
    if (savedVideo) setRecordedURL(savedVideo);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[640px] h-[480px]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute w-full h-full object-cover rounded-lg transform scale-x-[-1]"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]"
        />
        <canvas ref={recorderCanvasRef} className="hidden" />
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded text-white ${
          isRecording ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {recordedURL && (
        <video
          controls
          preload="auto" // Ensures full video is loaded (fixes range errors)
          src={recordedURL}
          className="w-[640px] h-[480px] rounded-lg mt-4"
        />
      )}
    </div>
  );
}
