import WorkInProgress from "@/components/ui/work-in-progress";

export default function InsightsPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our business insights dashboard is currently under construction. We're working hard to bring you comprehensive analytics and reporting!"
      progress={75}
      features={[
        { text: "Sales analytics", completed: true },
        { text: "Performance metrics", completed: true },
        { text: "Revenue tracking", completed: false },
        { text: "Custom reports", completed: false },
      ]}
    />
  );
}
