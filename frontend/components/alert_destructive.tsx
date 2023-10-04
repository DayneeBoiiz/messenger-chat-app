import { AlertCircle, FileWarning, Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="border-red-500">
      <AlertTitle className="text-red-500">Error</AlertTitle>
      <AlertDescription className="text-red-500">{message}</AlertDescription>
    </Alert>
  );
}
