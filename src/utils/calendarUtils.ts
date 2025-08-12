// src/utils/calendarUtils.ts
import { addMonths, subMonths, startOfMonth, endOfMonth, 
    startOfWeek, endOfWeek, addDays, format, isSameMonth, 
    isSameDay, differenceInDays } from 'date-fns';

export const generateCalendar = (date: Date): Date[] => {
const monthStart = startOfMonth(date);
const monthEnd = endOfMonth(monthStart);
const startDate = startOfWeek(monthStart);
const endDate = endOfWeek(monthEnd);

const days: Date[] = [];
let currentDate = startDate;

while (currentDate <= endDate) {
days.push(new Date(currentDate));
currentDate = addDays(currentDate, 1);
}

return days;
};

export const getDaysInMonth = (date: Date): number => {
return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const formatMonth = (date: Date): string => {
return format(date, 'MMMM yyyy');
};

export const getWeekdayNames = (): string[] => {
return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const isToday = (date: Date): boolean => {
const today = new Date();
return isSameDay(date, today);
};

export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
return isSameMonth(date, currentMonth);
};