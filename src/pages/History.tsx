import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface HistoryEntry {
  id: string;
  fileName: string;
  date: string;
  prediction: string;
  confidence: number;
  imageData: string;
}

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("dr_history") || "[]"));
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Analysis History</h1>
      <p className="mb-8 text-muted-foreground">View your previous retinal image analyses.</p>

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No analyses yet. Upload an image to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => {
            const isPositive = entry.prediction.toLowerCase().includes("detected");
            return (
              <Card key={entry.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <img src={entry.imageData} alt={entry.fileName} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{entry.fileName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    {isPositive ? (
                      <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${isPositive ? "text-destructive" : "text-accent"}`}>
                        {isPositive ? "Detected" : "Not Detected"}
                      </p>
                      <p className="text-xs text-muted-foreground">{(entry.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
