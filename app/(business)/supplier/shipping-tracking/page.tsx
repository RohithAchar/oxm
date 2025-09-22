import WorkInProgress from "@/components/ui/work-in-progress";

export default function ShippingTrackingPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our shipping and tracking system is currently under construction. We're working hard to bring you real-time logistics management!"
      progress={75}
      features={[
        { text: "Real-time tracking", completed: true },
        { text: "Shipping labels", completed: true },
        { text: "Delivery notifications", completed: false },
        { text: "Logistics analytics", completed: false },
      ]}
    />
  );
}
