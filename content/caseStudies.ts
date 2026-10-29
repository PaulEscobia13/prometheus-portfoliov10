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
  coverImage?: string;
  showcaseImage?: string;
  operationsImage?: string;
  workspaceImage?: string;
  story?: readonly {
    headline: string;
    quote: string;
    name: string;
    role: string;
    portrait: string;
    team?: boolean;
  }[];
  feedback: {
    quote: string;
    name: string;
    role: string;
    rating: number;
    isSample: boolean;
    portraitPosition: "left" | "right";
    portrait?: string;
  };
};

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "furniture-odyssey",
    coverImage: "/cases/furniture-odyssey-wide.png",
    showcaseImage: "/cases/furniture-odyssey-cart-showcase.png",
    operationsImage: "/cases/furniture-odyssey-operations.png",
    workspaceImage: "/cases/furniture-odyssey-workspace.png",
    name: "Furniture Odyssey",
    story: [
      {
        headline: "Great Online Business. Chaotic Work.",
        quote: "Before, pag kakausap ako ng client, kailangan kong maghanap ng pic para maka send sakanila ng catalog, madalas hiwa-hiwalay ito ng file or picture. Making quotations naman meant switching between multiple tabs, ang hassle at time consuming.",
        name: "Jane Escobia", role: "Owner, Furniture Odyssey", portrait: "/cases/jane-escobia.jpg",
      },
      {
        headline: "We brought their showroom online.",
        quote: "Gumawa kami ng digital furniture catalog kung saan madaling ma-explore ng customers ang products, collections, at designs. Hindi na kailangang mag-send ng pictures isa-isa sa bawat customer. Now, customers can browse their furniture anytime, anywhere, making it easier to attract more clients and showcase their products. The owner can also easily add, edit, and manage products anytime.",
        name: "Prometheus", role: "Team", portrait: "/favicons/prometheus-cursor.png", team: true,
      },
      {
        headline: "From endless scattered tabs to one powerful system used with just clicks.",
        quote: "Ginawa naming centralized ang buong operations nila. Quotations, orders, inventory, payments, deliveries, at sales reports, nasa iisang system na lang. Wala nang palipat-lipat ng tabs at manual tracking. A few clicks na lang, kita na agad ang status ng lahat.",
        name: "Prometheus", role: "Team", portrait: "/favicons/prometheus-cursor.png", team: true,
      },
      {
        headline: "90% less work. Focused on getting more clients instead of managing.",
        quote: "Dati, sobrang hassle mag-manage ng business, lalo na sa quotations, orders, at payments. Ngayon, everything is centralized in one system, a few clicks na lang! With our digital showroom, mas madali na rin ma-discover ng customers ang products namin. Sobrang laki ng nabawas sa workload ko, kaya mas nakakapag-focus na ako sa pagkuha ng new clients at pag-grow ng business. Mas marami na akong naa-accommodate.",
        name: "Jane Escobia", role: "Owner, Furniture Odyssey", portrait: "/cases/jane-escobia.jpg",
      },
    ],
    tags: ["Website", "Business System"],
    headline: "A digital showroom to attract customers. A business system that eliminated 90% of manual work.",
    description: "A public-facing furniture website paired with a business platform for products, quotations, orders, payments, and deliveries. Customer-facing pages and daily operations come together in one solution.",
    capabilities: ["Product catalog", "Quotations & orders", "Payments & deliveries"],
    category: "Furniture business platform",
    logo: "/partners/furniture-odyssey-original.png",
    liveUrl: "https://furniture-odyssey-catalog-website.vercel.app/",
    feedback: {
      quote: "Before, making quotations meant switching between multiple tabs, ang hassle at time-consuming. Now, everything is just a few clicks away! From quotations to orders and payments to deliveries, everything is centralized and organized. Sobrang laki ng nabawas sa workload ko, and now I can focus more on getting new clients. :)",
      name: "Jane Escobia",
      role: "Owner, Furniture Odyssey",
      portrait: "/cases/jane-escobia.jpg",
      rating: 5,
      isSample: false,
      portraitPosition: "left",
    },
  },
  {
    id: "piercing-corner",
    story: [
      {
        headline: "Behind the Counter of an Iconic Shop",
        quote: "Here at Piercing Corner, one of the challenges we face is managing physical waiver forms. As more customers avail our piercing services, mas dumarami rin ang paperwork na kailangan naming i-store at i-organize, which is a hassle and takes a lot of time. Another challenge is responding to customer inquiries, especially yung paulit-ulit na pag-send ng pictures ng jewelry at available services, which is also time-consuming and repetitive. Since our owner will also be busy preparing for childbirth, we needed a more efficient way to handle our daily operations and allow her to monitor and manage the business remotely, kahit hindi siya physically present sa shop.",
        name: "Piercing Corner", role: "Team", portrait: "/cases/piercing-corner-team-logo.png", team: true,
      },
      {
        headline: "Making Jewelries and Services Easier to Explore and Book",
        quote: "So, we developed a landing page where customers can easily browse their available products, jewelry, and piercing services. Instead of manually sending pictures and information every time may inquiry, pwede na nilang i-direct ang customers sa website. We also included an appointment booking system where customers can choose their preferred piercer and book a schedule.",
        name: "Prometheus", role: "Team", portrait: "/favicons/prometheus-cursor.png", team: true,
      },
      {
        headline: "Streamlining Business Operations, Anywhere",
        quote: "We also built a management system for the owner and staff to make their daily operations easier and more organized. We introduced digital waivers with e-signatures para hindi na kailangang mag-ipon at bumili ng physical papers. The system also includes appointment management, sales tracking and reports, and an organized workflow for handling customers and their services. Most importantly, it allows the owner to monitor and manage the business remotely, reducing repetitive work while making everyday operations more efficient.",
        name: "Prometheus", role: "Team", portrait: "/favicons/prometheus-cursor.png", team: true,
      },
    ],
    coverImage: "/cases/piercing-corner-retro-ear-logo.png",
    showcaseImage: "/cases/piercing-corner-website-mockup.png",
    operationsImage: "/cases/piercing-corner-tablet-mockup.png",
    workspaceImage: "/cases/piercing-corner-digital-studio.png",
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
