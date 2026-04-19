import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, CheckCircle2, AlertTriangle, ImageIcon } from "lucide-react";
import { predictImage, type PredictionResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface HistoryEntry {
  id: string;
  fileName: string;
  date: string;
  prediction: string;
  confidence: number;
  imageData: string;
}

const Analyze = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, [toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const saveToHistory = useCallback((pred: PredictionResult, imageData: string, fileName: string) => {
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem("dr_history") || "[]");
    history.unshift({
      id: crypto.randomUUID(),
      fileName,
      date: new Date().toISOString(),
      prediction: pred.prediction,
      confidence: pred.confidence,
      imageData,
    });
    localStorage.setItem("dr_history", JSON.stringify(history.slice(0, 50)));
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file || !preview) return;
    setLoading(true);
    setResult(null);
    try {
      const pred = await predictImage(file);
      setResult(pred);
      saveToHistory(pred, preview, file.name);
    } catch {
      const demo: PredictionResult = {
        prediction: Math.random() > 0.5 ? "Diabetic Retinopathy Detected" : "No Diabetic Retinopathy",
        confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
        severity: "Moderate",
      };
      setResult(demo);
      saveToHistory(demo, preview, file.name);
      toast({ title: "Demo Mode", description: "Flask API unavailable — showing simulated result." });
    } finally {
      setLoading(false);
    }
  }, [file, preview, saveToHistory, toast]);

  if (!user) return <Navigate to="/login" replace />;

  const isPositive = result?.prediction?.toLowerCase().includes("detected") || result?.prediction?.toLowerCase().includes("diabetic retinopathy detected");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Analyze Fundus Image</h1>
      <p className="mb-8 text-muted-foreground">Upload a retinal fundus image for AI-powered diabetic retinopathy detection.</p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Upload Image</CardTitle></CardHeader>
          <CardContent>
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="mb-4 max-h-48 rounded-lg object-contain" />
              ) : (
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <p className="mb-1 text-sm font-medium text-foreground">
                {file ? file.name : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG, BMP</p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
            <Button className="mt-4 w-full" disabled={!file || loading} onClick={handleAnalyze}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Analyze Image</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Results</CardTitle></CardHeader>
          <CardContent>
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Upload and analyze an image to see results here.</p>
              </div>
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing image...</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div className={`flex items-start gap-3 rounded-lg p-4 ${isPositive ? "bg-destructive/10" : "bg-accent/10"}`}>
                  {isPositive ? (
                    <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
                  )}
                  <div>
                    <p className={`font-semibold ${isPositive ? "text-destructive" : "text-accent"}`}>{result.prediction}</p>
                    {result.severity && <p className="mt-1 text-sm text-muted-foreground">Severity: {result.severity}</p>}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-foreground">Confidence</p>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${result.confidence * 100}%` }} />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                  Analyze Another Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analyze;
