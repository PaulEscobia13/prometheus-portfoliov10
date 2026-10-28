import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import Hero from "../../components/Hero";
import SmoothScroll from "../../components/SmoothScroll";
import Services from "../../components/Services";
import CaseStudySection from "../../components/CaseStudySection";
import RotatingFavicon from "../../components/RotatingFavicon";
import ShowcaseSection from "../../components/ShowcaseSection";
import PricingSection from "../../components/PricingSection";
import TeamSection from "../../components/TeamSection";
import "lenis/dist/lenis.css";
import "./preview.css";
import "./cases.css";
import "./showcase.css";
import "./pricing.css";
import "./team.css";

export const metadata: Metadata = {
  title: "Prometheus | Tech Products and Services",
  robots: { index: false, follow: false },
};

export default function PrometheusPreview() {
  return (
    <div className="page-wrapper prometheus-preview">
      <SmoothScroll />
      <RotatingFavicon />
      <Navigation brand="prometheus" />
      <main className="page-main">
        <div className="prometheus-intro-stage">
          <Hero brand="prometheus" />
          <Services />
        </div>
        <CaseStudySection />
        <ShowcaseSection />
        <PricingSection />
        <TeamSection />
      </main>
    </div>
  );
}
