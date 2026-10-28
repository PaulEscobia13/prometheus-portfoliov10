export type CaseStudy = {
  id: string;
  name: string;
  tags: readonly string[];
  headline: string;
  description: string;
  capabilities: readonly string[];
  category: string;
  logo: string;
  liveUrl: string;
  screenshot?: string;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "furniture-odyssey",
    name: "Furniture Odyssey",
    tags: ["Website", "Business System"],
    headline: "A connected furniture platform, from product discovery to business operations.",
    description: "A public-facing furniture website paired with a business platform for products, quotations, orders, payments, and deliveries. Customer-facing pages and daily operations come together in one solution.",
    capabilities: ["Product catalog", "Quotations & orders", "Payments & deliveries"],
    category: "Furniture business platform",
    logo: "/partners/furniture-odyssey-original.png",
    liveUrl: "https://furniture-odyssey-catalog-website.vercel.app/",
  },
  {
    id: "piercing-corner",
    name: "Piercing Corner",
    tags: ["Website", "Management System"],
    headline: "A public website and custom management system for a piercing studio.",
    description: "A website and studio management system covering services, piercers, schedules, clients, and day-to-day operations. Designed around the practical needs of a service business.",
    capabilities: ["Services & piercers", "Scheduling", "Client management"],
    category: "Studio website & operations",
    logo: "/partners/piercing-corner-original.png",
    liveUrl: "https://piercing-corner.vercel.app/",
  },
];
