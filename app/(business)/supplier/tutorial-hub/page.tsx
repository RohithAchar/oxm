import WorkInProgress from "@/components/ui/work-in-progress";

export default function TutorialHubPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our tutorial hub is currently under construction. We're working hard to bring you comprehensive learning resources!"
      progress={75}
      features={[
        { text: "Video tutorials", completed: true },
        { text: "Step-by-step guides", completed: true },
        { text: "Interactive learning", completed: false },
        { text: "Progress tracking", completed: false },
      ]}
    />
  );
}
