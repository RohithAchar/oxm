import WorkInProgress from "@/components/ui/work-in-progress";

export default function NoticePage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our notice board system is currently under construction. We're working hard to bring you a comprehensive communication platform!"
      progress={75}
      features={[
        { text: "Real-time notifications", completed: true },
        { text: "Announcement management", completed: true },
        { text: "Priority messaging", completed: false },
        { text: "Bulk notifications", completed: false },
      ]}
    />
  );
}
