import WorkInProgress from "@/components/ui/work-in-progress";

export default function EnquiryPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our enquiry management system is currently under construction. We're working hard to bring you a powerful lead management platform!"
      progress={75}
      features={[
        { text: "Lead tracking", completed: true },
        { text: "Response management", completed: true },
        { text: "Automated follow-ups", completed: false },
        { text: "Analytics dashboard", completed: false },
      ]}
    />
  );
}
