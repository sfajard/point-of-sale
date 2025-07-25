// src/components/dashboard/DateRangePickerWithPresets.tsx
"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangePickerWithPresets({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });

  // Anda akan perlu menggunakan 'date' ini untuk mem-filter data dashboard
  // Misalnya, panggil API Anda lagi dengan rentang tanggal ini
  React.useEffect(() => {
    if (date?.from && date?.to) {
      console.log("Fetching data for:", format(date.from, "yyyy-MM-dd"), "to", format(date.to, "yyyy-MM-dd"));
      // Di sini Anda akan memanggil fungsi untuk me-load ulang data dashboard
      // Contoh: loadDashboardData(date.from, date.to);
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih Tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Select
            onValueChange={(value) => {
              const today = new Date();
              let newFrom = today;
              let newTo = today;

              switch (value) {
                case "today":
                  newFrom = today;
                  newTo = today;
                  break;
                case "yesterday":
                  newFrom = addDays(today, -1);
                  newTo = addDays(today, -1);
                  break;
                case "last7days":
                  newFrom = addDays(today, -6);
                  newTo = today;
                  break;
                case "last30days":
                  newFrom = addDays(today, -29);
                  newTo = today;
                  break;
                case "thismonth":
                  newFrom = new Date(today.getFullYear(), today.getMonth(), 1);
                  newTo = today;
                  break;
                case "lastmonth":
                  newFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  newTo = new Date(today.getFullYear(), today.getMonth(), 0);
                  break;
                default:
                  break;
              }
              setDate({ from: newFrom, to: newTo });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Presets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="yesterday">Kemarin</SelectItem>
              <SelectItem value="last7days">7 Hari Terakhir</SelectItem>
              <SelectItem value="last30days">30 Hari Terakhir</SelectItem>
              <SelectItem value="thismonth">Bulan Ini</SelectItem>
              <SelectItem value="lastmonth">Bulan Lalu</SelectItem>
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}