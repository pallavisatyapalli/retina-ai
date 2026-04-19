import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Upload, BarChart3, ShieldCheck } from "lucide-react";

const steps = [
{ icon: Upload, title: "Upload", desc: "Upload a retinal fundus image from your device" },
{ icon: Eye, title: "Analyze", desc: "Our deep learning model analyzes the image" },
{ icon: BarChart3, title: "Results", desc: "Get an instant prediction with confidence score" }];


const Landing = () =>
<div className="flex flex-col">
    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-24 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          


          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Early Detection of{" "}
            <span className="text-primary">Diabetic Retinopathy</span>
          </h1>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Upload retinal fundus images and get instant AI-powered analysis using deep learning.
            Detect diabetic retinopathy early to prevent vision loss.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground">How It Works</h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
          Three simple steps to analyze retinal images for signs of diabetic retinopathy.
        </p>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((s, i) =>
        <div key={i} className="group flex flex-col items-center rounded-xl border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {i + 1}</span>
              <h3 className="mb-2 text-lg font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
        )}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="border-t bg-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to Detect Early?</h2>
        <p className="mb-8 text-muted-foreground">Create an account and start analyzing fundus today.</p>
        <Button size="lg" asChild>
          <Link to="/register">Create Free Account</Link>
        </Button>
      </div>
    </section>
  </div>;


export default Landing;