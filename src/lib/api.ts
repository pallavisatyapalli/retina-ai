// Configure your Flask API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface PredictionResult {
  prediction: string; // e.g., "Diabetic Retinopathy Detected" or "No Diabetic Retinopathy"
  confidence: number; // 0-1 float
  severity?: string;  // optional severity level
}

/**
 * Send a fundus image to the Flask /predict endpoint.
 *
 * Expected Flask API:
 *   POST /predict
 *   Content-Type: multipart/form-data
 *   Body: { file: <image_file> }
 *
 * Expected Response:
 *   { "prediction": "Diabetic Retinopathy Detected", "confidence": 0.92, "severity": "Moderate" }
 */
export async function predictImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
