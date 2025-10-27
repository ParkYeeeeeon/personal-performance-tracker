import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachWeekOfInterval, eachDayOfInterval } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd'): string {
  return format(new Date(date), formatStr);
}

export function getWeekStart(date: string | Date = new Date()): Date {
  return startOfWeek(new Date(date), { weekStartsOn: 0 }); // Sunday
}

export function getWeekEnd(date: string | Date = new Date()): Date {
  return endOfWeek(new Date(date), { weekStartsOn: 0 });
}

export function getMonthStart(date: string | Date = new Date()): Date {
  return startOfMonth(new Date(date));
}

export function getMonthEnd(date: string | Date = new Date()): Date {
  return endOfMonth(new Date(date));
}

export function getWeekDays(date: string | Date = new Date()): Date[] {
  const start = getWeekStart(date);
  const end = getWeekEnd(date);
  return eachDayOfInterval({ start, end });
}

export function getMonthWeeks(date: string | Date = new Date()): Date[][] {
  const monthStart = getMonthStart(date);
  const monthEnd = getMonthEnd(date);
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });
  return weeks.map(weekStart => getWeekDays(weekStart));
}

export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateInRange(date: Date, startDate: string | null, endDate: string | null): boolean {
  const normalizedDate = normalizeDate(date);
  
  if (startDate && endDate) {
    const start = normalizeDate(new Date(startDate));
    const end = normalizeDate(new Date(endDate));
    return normalizedDate >= start && normalizedDate <= end;
  }
  
  // 시작일만 있는 경우에는 시작일 하루만 표시
  if (startDate && !endDate) {
    const start = normalizeDate(new Date(startDate));
    return normalizedDate.getTime() === start.getTime();
  }
  
  // 종료일만 있는 경우에는 종료일에만 표시
  if (!startDate && endDate) {
    const end = normalizeDate(new Date(endDate));
    return normalizedDate.getTime() === end.getTime();
  }
  
  return false;
}


