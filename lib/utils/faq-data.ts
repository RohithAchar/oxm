import { FaqItem } from "@/types/faq";

export const supplierFaqs: FaqItem[] = [
  {
    id: "getting-started-register",
    category: "Getting Started",
    question: "How can I register as a supplier on OpenXmart?",
    answer:
      "Go to the supplier registration page, fill your business details (company name, GST, phone number, etc.), verify via OTP, and your account will be created instantly.",
    tags: ["register", "signup", "supplier"],
  },
  {
    id: "getting-started-cost",
    category: "Getting Started",
    question: "Is there any cost to join as a supplier?",
    answer:
      "No. Signing up and listing products on OpenXmart is completely free.",
    tags: ["pricing", "cost"],
  },
  {
    id: "getting-started-docs",
    category: "Getting Started",
    question: "What documents are required to sell?",
    answer:
      "Basic KYC (business name, address, GST). For trust score and premium features, additional documents may be requested.",
    tags: ["kyc", "gst", "verification"],
  },
  {
    id: "listing-how",
    category: "Product Listing & Management",
    question: "How do I list my products?",
    answer:
      "Go to the dashboard → Add Product → upload product details (title, description, price, MOQ, images).",
    tags: ["listing", "products"],
  },
  {
    id: "listing-limit",
    category: "Product Listing & Management",
    question: "Is there a limit to how many products I can upload?",
    answer: "No, you can list unlimited products for free.",
  },
  {
    id: "listing-edit",
    category: "Product Listing & Management",
    question: "Can I edit or delete a product after uploading?",
    answer:
      "Yes. You can edit, update, or remove products anytime from your dashboard.",
  },
  {
    id: "enquiry-what",
    category: "Enquiry & BuyLead",
    question: "What is an enquiry?",
    answer:
      "An enquiry is when a buyer shows interest in your product but has not yet placed an order. You can reply and start a conversation.",
  },
  {
    id: "buylead-what",
    category: "Enquiry & BuyLead",
    question: "What is a BuyLead?",
    answer:
      "A BuyLead is a verified potential buyer who clicked RFQ on your product. You get their details as a lead.",
  },
  {
    id: "enquiry-how",
    category: "Enquiry & BuyLead",
    question: "How do I receive enquiries and BuyLeads?",
    answer:
      "Buyers can click on your product to send enquiries. When they click RFQ, it becomes a BuyLead that you can view in your dashboard.",
  },
  {
    id: "enquiry-cost",
    category: "Enquiry & BuyLead",
    question: "Do I need to pay for enquiries or BuyLeads?",
    answer:
      "No. Enquiries and BuyLeads are free. You only pay commission when you sell through sample orders.",
  },
  {
    id: "sample-what",
    category: "Sample Orders",
    question: "What is a sample order?",
    answer:
      "A small-quantity order placed by buyers to check product quality before bulk purchase.",
  },
  {
    id: "sample-commission",
    category: "Sample Orders",
    question: "How does commission work on sample orders?",
    answer:
      "First ₹1000 → 10% commission. Example: On ₹2000 order → ₹200 commission.",
  },
  {
    id: "sample-to-bulk",
    category: "Sample Orders",
    question: "How do sample orders generate Bulk Orders?",
    answer:
      "Once a buyer orders a sample, they automatically become a qualified trust lead. You’ll have higher chances of converting them into bulk buyers.",
  },
  {
    id: "payments-payout",
    category: "Payments",
    question: "How do I get paid for sample orders?",
    answer:
      "Payments are transferred to your registered bank account after successful delivery.",
  },
  {
    id: "payments-settlement",
    category: "Payments",
    question: "What is the payment settlement time?",
    answer: "Within 2–4 working days after order completion.",
  },
  {
    id: "payments-charges",
    category: "Payments",
    question: "Are there any hidden charges apart from commission?",
    answer: "No. Only commission on sample orders and bulk orders.",
  },
  {
    id: "trust-what",
    category: "Trust Score & Verification",
    question: "What is a Trust Score?",
    answer:
      "Trust Score shows your reliability to buyers. Higher score means more buyer confidence.",
  },
  {
    id: "trust-improve",
    category: "Trust Score & Verification",
    question: "How can I improve my Trust Score?",
    answer:
      "Complete KYC verification, deliver samples on time, gather positive feedback, and stay consistently active.",
  },
  {
    id: "trust-visible",
    category: "Trust Score & Verification",
    question: "Is Trust Score visible to buyers?",
    answer: "Yes, it appears on your supplier profile and product pages.",
  },
  {
    id: "support-where",
    category: "Support & Assistance",
    question: "Where can I get help if I face issues?",
    answer:
      "Check the Help Center for FAQs & guides. If not solved, use Contact Us to connect with our support team.",
  },
  {
    id: "support-how",
    category: "Support & Assistance",
    question: "How can I contact support?",
    answer:
      "You can reach us via email, WhatsApp, or by raising a ticket in your dashboard.",
  },
  {
    id: "support-sla",
    category: "Support & Assistance",
    question: "What is the response time for queries?",
    answer: "Usually within 24 hours on working days.",
  },
  {
    id: "policy-safety",
    category: "Policies & Safety",
    question: "What if a buyer scams me outside the platform?",
    answer:
      "Any payments or deals outside OpenXmart are at your own risk and not protected by OpenXmart Trade Assurance.",
  },
  {
    id: "policy-disputes",
    category: "Policies & Safety",
    question: "Does OpenXmart handle disputes?",
    answer: "Yes.",
  },
  {
    id: "policy-products",
    category: "Policies & Safety",
    question: "Can I sell any type of product?",
    answer:
      "Only legal and compliant products are allowed. Restricted items (weapons, illegal goods, counterfeit) are banned.",
  },
];

export const faqCategories = Array.from(
  new Set(supplierFaqs.map((f) => f.category))
);
