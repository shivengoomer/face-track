export const startCamera = async (videoRef) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  } catch (error) {
    console.error("Error starting camera:", error);
  }
};
