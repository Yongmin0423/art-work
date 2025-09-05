import { Badge } from "~/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending_approval":
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-600">
          승인 대기
        </Badge>
      );
    case "available":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          승인됨
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          거절됨
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "pending_approval":
      return "승인 대기";
    case "available":
      return "승인됨";
    case "rejected":
      return "거절됨";
    default:
      return status;
  }
};