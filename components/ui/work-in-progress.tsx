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

interface WorkInProgressProps {
  title?: string;
  description?: string;
  progress?: number;
  features?: Array<{
    text: string;
    completed?: boolean;
  }>;
  contactEmail?: string;
  className?: string;
}

export default function WorkInProgress({
  title = "We're Building Something Amazing",
  description = "This feature is currently under construction. We're working hard to bring you something special!",
  progress = 75,
  features = [
    { text: "Modern, responsive design", completed: true },
    { text: "Lightning-fast performance", completed: true },
    { text: "Enhanced user experience", completed: false },
    { text: "New features and tools", completed: false },
  ],
  contactEmail = "support@openxmart.com",
  className = "",
}: WorkInProgressProps) {
  return (
    <div
      className={`min-h-screen bg-background flex items-center justify-center p-4 ${className}`}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Hammer className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
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
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      feature.completed ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  ></div>
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-muted-foreground">
          Questions? Contact us at{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-primary hover:underline"
          >
            {contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
