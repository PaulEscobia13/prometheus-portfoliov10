import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import Hero from "../../components/Hero";
import "./preview.css";

export const metadata: Metadata = {
  title: "Prometheus — background and wordmark study",
  robots: { index: false, follow: false },
};

export default function PrometheusPreview() {
  return (
    <div className="page-wrapper prometheus-preview">
      <Navigation brand="prometheus" />
      <main className="page-main"><Hero /></main>
    </div>
  );
}
