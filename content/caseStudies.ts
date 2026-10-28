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
  screenshots?: readonly string[];
  feedback: {
    quote: string;
    name: string;
    role: string;
    rating: number;
    isSample: boolean;
    portraitPosition: "left" | "right";
  };
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
    feedback: {
      quote: "The team paid attention to how our business works and made the platform easy to use. From browsing products to managing orders, the experience feels connected, clear, and thoughtfully put together.",
      name: "Alex Reyes",
      role: "Sample client representative",
      rating: 5,
      isSample: true,
      portraitPosition: "left",
    },
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
    feedback: {
      quote: "The website and management tools make our day-to-day work feel more organized. The team listened carefully, kept things straightforward, and created an experience that feels welcoming for our clients and practical for our studio.",
      name: "Mia Santos",
      role: "Sample client representative",
      rating: 5,
      isSample: true,
      portraitPosition: "right",
    },
  },
];
