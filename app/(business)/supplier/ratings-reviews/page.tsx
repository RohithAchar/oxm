import WorkInProgress from "@/components/ui/work-in-progress";

export default function RatingsReviewsPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our ratings and reviews system is currently under construction. We're working hard to bring you comprehensive reputation management!"
      progress={75}
      features={[
        { text: "Review management", completed: true },
        { text: "Rating analytics", completed: true },
        { text: "Customer feedback", completed: false },
        { text: "Reputation insights", completed: false },
      ]}
    />
  );
}
