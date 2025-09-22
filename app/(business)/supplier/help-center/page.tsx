import WorkInProgress from "@/components/ui/work-in-progress";

export default function HelpCenterPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our help center is currently under construction. We're working hard to bring you comprehensive support resources!"
      progress={75}
      features={[
        { text: "Knowledge base", completed: true },
        { text: "FAQ section", completed: true },
        { text: "Live chat support", completed: false },
        { text: "Ticket system", completed: false },
      ]}
    />
  );
}
