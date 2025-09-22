import { AlertCircle, Clock, Hammer } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Hammer className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              We're Building Something Amazing
            </CardTitle>
            <CardDescription className="text-slate-600">
              Our notification system is currently under construction. We're
              working hard to keep you updated with the latest information!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium text-slate-900">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            {/* Launch Timeline */}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Expected launch: <strong>Coming Soon</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">What's Coming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-slate-600">Real-time notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-slate-600">Email notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span className="text-slate-600">Push notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                <span className="text-slate-600">Notification preferences</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-slate-500">
          Questions? Contact us at{" "}
          <a
            href="mailto:support@openxmart.com"
            className="text-blue-600 hover:underline"
          >
            support@openxmart.com
          </a>
        </div>
      </div>
    </div>
  );
}
