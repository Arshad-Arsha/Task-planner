// src/components/CalendarHeader.tsx
import React from 'react';
import { formatMonth, getWeekdayNames } from '../utils/calendarUtils';
import { addMonths, subMonths } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  currentDate, 
  setCurrentDate 
}) => {
  const monthName = formatMonth(currentDate);
  const weekdays = getWeekdayNames();
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  return (
    <div className="calendar-header">
      <div className="month-navigation">
        <button onClick={goToPreviousMonth} className="nav-button">
          <FaChevronLeft/>
        </button>
        <h2>{monthName}</h2>
        <button onClick={goToNextMonth} className="nav-button">
          <FaChevronRight/>
        </button>
      </div>
      
      <div className="weekdays">
        {weekdays.map((day, index) => (
          <div key={index} className="weekday">{day}</div>
        ))}
      </div>
    </div>
  );
};