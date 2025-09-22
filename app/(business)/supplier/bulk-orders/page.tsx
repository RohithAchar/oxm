import WorkInProgress from "@/components/ui/work-in-progress";

export default function BulkOrdersPage() {
  return (
    <WorkInProgress
      title="We're Building Something Amazing"
      description="Our bulk orders management system is currently under construction. We're working hard to bring you comprehensive order processing tools!"
      progress={75}
      features={[
        { text: "Order processing", completed: true },
        { text: "Inventory management", completed: true },
        { text: "Bulk operations", completed: false },
        { text: "Order analytics", completed: false },
      ]}
    />
  );
}
