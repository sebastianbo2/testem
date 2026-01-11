import { parseISO, format } from "date-fns"

export default function formatDate(timestamp: string) {
  return timestamp
  ? format(parseISO(timestamp), "MM-dd-yyyy")
  : "N/A";
}