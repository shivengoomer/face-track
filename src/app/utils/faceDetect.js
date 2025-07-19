import * as faceapi from "face-api.js";

export const detectFaces = async (videoRef, canvasRef) => {
  if (!videoRef.current || !canvasRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const detectionLoop = async () => {
    const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    
    // Resize and draw detections
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    ctx.drawImage(video, 0, 0, displaySize.width, displaySize.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    requestAnimationFrame(detectionLoop);
  };

  detectionLoop();
};
