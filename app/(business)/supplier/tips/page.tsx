import WorkInProgress from "@/components/ui/work-in-progress";

export default function TipsPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our tips and tutorials section is currently under construction. We're working hard to bring you valuable insights and guidance!"
      progress={75}
      features={[
        { text: "Expert tips and tricks", completed: true },
        { text: "Video tutorials", completed: true },
        { text: "Step-by-step guides", completed: false },
        { text: "Best practices", completed: false },
      ]}
    />
  );
}
