import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import Hero from "../../components/Hero";
import SmoothScroll from "../../components/SmoothScroll";
import Services from "../../components/Services";
import CaseStudySection from "../../components/CaseStudySection";
import "lenis/dist/lenis.css";
import "./preview.css";
import "./cases.css";

export const metadata: Metadata = {
  title: "Prometheus — background and wordmark study",
  robots: { index: false, follow: false },
};

export default function PrometheusPreview() {
  return (
    <div className="page-wrapper prometheus-preview">
      <SmoothScroll />
      <Navigation brand="prometheus" />
      <main className="page-main">
        <div className="prometheus-intro-stage">
          <Hero brand="prometheus" />
          <Services />
        </div>
        <CaseStudySection />
      </main>
    </div>
  );
}
