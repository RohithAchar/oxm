import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SupportCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Card className="p-4">
        <h3 className="font-semibold">Email Support</h3>
        <p className="text-sm text-muted-foreground mt-1">
          For detailed issues or account help, email us.
        </p>
        <div className="mt-2">
          <Link href="mailto:support@openxmart.com" className="text-primary">
            support@openxmart.com
          </Link>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Live Chat</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Get real-time help for urgent cases.
        </p>
        <div className="mt-2">
          <Link href="/supplier/enquiry?user=support" className="text-primary">
            Start chat
          </Link>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Response Time</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We respond within 24 hours on working days.
        </p>
      </Card>
    </div>
  );
}
