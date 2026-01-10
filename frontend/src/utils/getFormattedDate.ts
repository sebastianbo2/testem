import { parseISO, format } from "date-fns"

export default function getFormattedDate(timestamp: string) {
  return timestamp
  ? format(parseISO(timestamp), "MM-dd-yyyy")
  : "N/A";
}