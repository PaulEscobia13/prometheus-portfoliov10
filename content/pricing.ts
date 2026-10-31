export const pricingPlans = [
  {
    id: "essential",
    name: "Business Website",
    price: "₱2,000",
    unit: "One-Time Payment",
    description: "For business owners who want customers to discover and connect with their business through a professional public website, optimized for Google Search and structured to help AI-powered search tools understand their products and services.",
    action: "Start a project",
    featured: false,
    features: [
      "One- to multi-page website tailored to your business",
      "Custom visual design and branding",
      "Mobile-friendly, responsive layout",
      "Basic Google SEO setup",
      "Free website hosting",
      "Free branded subdomain (yourbusiness.prmths.com)",
      "Contact buttons and social media integration",
    ],
  },
  {
    id: "premium",
    name: "Business Management System",
    price: "₱8,999",
    unit: "One-Time Payment",
    description: "for business owners to empower themselves, and their staff with a centralized digital system accessible through phone, tablet, laptop/PC. Reducing manual work, improving efficiency, providing financial analytics, and gaining greater control over daily operations, anytime and anywhere.",
    action: "Start a project",
    featured: true,
    features: [
      "Custom system tailored to your business",
      "Centralized business dashboard (Accessible through Phone, Tablet, Laptop/PC)",
      "Customer and business records management",
      "Workflow automation and tracking",
      "Sales reports and analytics",
      "Secure staff accounts and role-based access (Owner, Manager, Staff)",
      "Free hosting and branded subdomain",
    ],
  },
  {
    id: "partnership",
    name: "Business Management System",
    price: "₱2,000",
    unit: "/module",
    description: "For business owners who only have 1–2 major problems. We focus on those problems and build a digital solution for each specific problem.",
    action: "Get in touch",
    featured: false,
    features: [
      "One major business problem solved at a time",
      "Custom-built, fully functional module",
      "Accessible on phone, tablet, and laptop/PC",
      "Deployment, testing, and support",
      "Expandable system with seamless future integrations",
    ],
  },
] as const;


export const personalPlans = [
 { id: "personal-website", name: "Personal Website", price: "₱1,000", unit: "One-Time Payment", description: "Your own space online to introduce yourself, share your story, and showcase what you do. Ideal for personal portfolios and creative projects.", action: "Start a project", featured: false, features: ["Custom visual design", "Mobile-friendly, responsive layout", "About, portfolio, and contact sections", "Social media and contact links", "Basic Google SEO setup", "Free hosting and branded subdomain"] },
 { id: "professional-website", name: "Professional Website", price: "₱2,499", unit: "One-Time Payment", description: "A professional website with CRM and management tools to showcase your expertise, organize client relationships, and manage your work. Good for VAs, brokers, freelancers, consultants, and independent professionals.", action: "Start a project", featured: true, features: ["Website tailored to your profession", "CRM and client records management", "Management system tailored to your workflow", "Custom visual design and branding", "Services, portfolio, and testimonials", "Mobile-friendly, responsive layout", "Contact and booking links", "Basic Google SEO setup", "Free hosting and branded subdomain"] },
] as const;

export const customPlans = [
 { id: "custom", name: "Custom Solution", price: "Custom pricing", unit: "", description: "Have something different in mind? Tell us what you need, and we’ll shape a website or digital system around your goals, scope, and budget.", action: "Discuss your project", featured: false, features: ["Scope tailored to your needs", "Custom design and development", "Responsive experience across devices", "Integrations and automation as needed", "Testing, deployment, and support"] },
] as const;
