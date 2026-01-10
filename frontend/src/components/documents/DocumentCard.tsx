import { Document as DocumentType } from "@/types/exam";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, File, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import getFormattedDate from "@/utils/getFormattedDate";
import { formatBytes } from "@/utils/formatBytes";

interface DocumentCardProps {
  document: DocumentType;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (document: DocumentType) => void;
}

export const DocumentCard = ({
  document,
  isSelected,
  onSelect,
  onDelete,
}: DocumentCardProps) => {
  const Icon = document.type === "application/pdf" ? FileText : File;

  return (
    <div
      className={cn(
        "card-academic p-4 flex items-center gap-4 cursor-pointer transition-all",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={() => onSelect(document.id, !isSelected)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(document.id, !!checked)}
        onClick={(e) => e.stopPropagation()}
      />

      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          document.type === "application/pdf"
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">
          {document["display_name"]}
        </h4>
        <p className="text-xs text-muted-foreground">
          {formatBytes(document.size)} •{" "}
          {getFormattedDate(document["created_at"])}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(document);
        }}
        className="opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
