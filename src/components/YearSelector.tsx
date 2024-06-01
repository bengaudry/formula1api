import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export function YearSelector({
  year,
  onChangeYear,
}: {
  year: string | undefined | null;
  onChangeYear: (year: string) => void;
}) {
  const years = ["2024"];

  useEffect(() => {
    if (!year || !years.includes(year)) {
      onChangeYear(new Date().getFullYear().toString());
    }
  }, [year]);

  return (
    <Select onValueChange={onChangeYear} defaultValue={year as string}>
      <SelectTrigger>
        <SelectValue placeholder="Select a year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem value="2024" defaultChecked={y === year}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
