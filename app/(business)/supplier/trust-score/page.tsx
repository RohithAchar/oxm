import WorkInProgress from "@/components/ui/work-in-progress";

export default function TrustScorePage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our trust score system is currently under construction. We're working hard to bring you a comprehensive reputation management system!"
      progress={75}
      features={[
        { text: "Real-time trust scoring", completed: true },
        { text: "Performance analytics", completed: true },
        { text: "Reputation insights", completed: false },
        { text: "Improvement recommendations", completed: false },
      ]}
    />
  );
}
