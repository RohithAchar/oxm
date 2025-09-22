import WorkInProgress from "@/components/ui/work-in-progress";

export default function SampleOrdersPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our sample orders management system is currently under construction. We're working hard to bring you efficient sample order tracking!"
      progress={75}
      features={[
        { text: "Order tracking", completed: true },
        { text: "Status updates", completed: true },
        { text: "Sample requests", completed: false },
        { text: "Quality feedback", completed: false },
      ]}
    />
  );
}
