import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import Hero from "../../components/Hero";
import SmoothScroll from "../../components/SmoothScroll";
import Services from "../../components/Services";
import "lenis/dist/lenis.css";
import "./preview.css";

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
        <div className="prometheus-hero-stage"><Hero brand="prometheus" /></div>
        <Services />
      </main>
    </div>
  );
}
