import Badge from "@/components/ui/Badge";

type CmsStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED"
  | "FEATURED"
  | "INACTIVE"
  | string;

const statusTone: Record<string, "default" | "success" | "warning" | "danger" | "muted"> = {
  DRAFT: "muted",
  PENDING_REVIEW: "warning",
  PUBLISHED: "success",
  REJECTED: "danger",
  ARCHIVED: "muted",
  FEATURED: "default",
  INACTIVE: "muted",
};

const statusLabel: Record<string, string> = {
  DRAFT: "Nháp",
  PENDING_REVIEW: "Chờ duyệt",
  PUBLISHED: "Xuất bản",
  REJECTED: "Từ chối",
  ARCHIVED: "Lưu trữ",
  FEATURED: "Nổi bật",
  INACTIVE: "Ẩn",
};

type CmsStatusBadgeProps = {
  status: CmsStatus;
  label?: string;
};

export default function CmsStatusBadge({ status, label }: CmsStatusBadgeProps) {
  const key = String(status).toUpperCase();

  return (
    <Badge variant={statusTone[key] || "muted"}>
      {label || statusLabel[key] || status}
    </Badge>
  );
}
