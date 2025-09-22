import WorkInProgress from "@/components/ui/work-in-progress";

export default function ContactUsPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our contact system is currently under construction. We're working hard to bring you seamless communication channels!"
      progress={75}
      features={[
        { text: "Contact forms", completed: true },
        { text: "Support tickets", completed: true },
        { text: "Live chat", completed: false },
        { text: "Priority support", completed: false },
      ]}
    />
  );
}
