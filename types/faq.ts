export type FaqCategory =
  | "Getting Started"
  | "Product Listing & Management"
  | "Enquiry & BuyLead"
  | "Sample Orders"
  | "Payments"
  | "Trust Score & Verification"
  | "Support & Assistance"
  | "Policies & Safety";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  tags?: string[];
}
