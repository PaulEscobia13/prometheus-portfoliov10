import type { Metadata } from "next";
import Image from "next/image";
import ProjectInquiry from "../../../components/ProjectInquiry";
import { contact } from "../../../content/contact";
import "@fontsource/manrope/latin-400.css";
import "./contact.css";

export const metadata: Metadata = { title: "Let’s talk about your project | Prometheus", robots: { index: false, follow: false } };

export default function ContactPage() {
  return <main className="inquiry-page">
    <header className="inquiry-header"><a href="/prometheus" aria-label="Prometheus home">prometheus</a><a href="/prometheus">Back to home ↗</a></header>
    <div className="inquiry-layout">
      <aside className="inquiry-profile">
        <div className="inquiry-person"><Image src="/team/rex-oliver-jumawid.png" alt="Oliver Jumawid" width={110} height={110} priority /><div><h2>Oliver Jumawid</h2><p>Co-Founder &amp; DevOps</p></div></div>
        <p className="inquiry-promise">Your next idea.<br /><em>Our next build.</em></p>
        <ul><li>Let’s understand your business and the problem you want to solve.</li><li>See a free prototype before deciding to move forward.</li><li>Start with what matters most and grow from there.</li></ul>
        <div className="inquiry-profile-bottom"><p>A conversation is a good place to start.</p><a href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">Go straight to the calendar ↗</a></div>
      </aside>
      <ProjectInquiry />
    </div>
  </main>;
}
