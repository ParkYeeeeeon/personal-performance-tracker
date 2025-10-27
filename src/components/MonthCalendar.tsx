import { useState, useEffect, useRef } from 'react';
import { format, setMonth, setYear } from 'date-fns';
import { getMonthWeeks, formatDate, isDateInRange } from '@/utils/date';
import type { TaskBlock, CalendarEvent } from '@/types';

interface MonthCalendarProps {
  selectedDate: Date;
  tasks: TaskBlock[];
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
}

export function MonthCalendar({ selectedDate, tasks, events, onDateClick }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const dateSelectorRef = useRef<HTMLDivElement>(null);
  const monthWeeks = getMonthWeeks(currentMonth);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  
  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateSelectorRef.current && !dateSelectorRef.current.contains(event.target as Node)) {
        setShowYearSelector(false);
      }
    };
    
    if (showYearSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showYearSelector]);
  
  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(setMonth(currentMonth, monthIndex));
  };
  
  const handleYearChange = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setShowYearSelector(false);
  };
  
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const getTasksForDate = (date: Date): TaskBlock[] => {
    const dateStr = formatDate(date);
    
    return tasks.filter(task => {
      // task.date가 정확히 일치하는 경우
      if (task.date === dateStr) {
        return true;
      }
      
      // task.date와 다르고 startDate/deadline이 있는 경우에만 범위 체크
      if (task.date !== dateStr) {
        return isDateInRange(date, task.startDate || null, task.deadline || null);
      }
      
      return false;
    });
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const isCurrentMonth = (date: Date): boolean => {
    return format(date, 'yyyy-MM') === format(currentMonth, 'yyyy-MM');
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateClick?.(today);
  };

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const isWeekend = (day: Date) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0: 일요일, 6: 토요일
  };

  // 한국 공휴일 체크 (2024년 기준, 간단한 구현)
  const isHoliday = (day: Date): boolean => {
    const year = day.getFullYear();
    const month = day.getMonth() + 1;
    const date = day.getDate();
    
    // 신정, 설날, 어린이날, 어버이날, 현충일, 광복절, 추석, 개천절, 한글날, 크리스마스
    const holidays = [
      `${year}-01-01`, // 신정
      `${year}-03-01`, // 삼일절
      `${year}-05-05`, // 어린이날
      `${year}-06-06`, // 현충일
      `${year}-08-15`, // 광복절
      `${year}-10-03`, // 개천절
      `${year}-10-09`, // 한글날
      `${year}-12-25`, // 크리스마스
    ];
    
    const dateStr = format(day, 'yyyy-MM-dd');
    return holidays.includes(dateStr);
  };

  return (
    <div className="month-calendar">
      <div className="date-selector-container" ref={dateSelectorRef}>
        <div className="date-selector-row">
          <button 
            className="date-select-button"
            onClick={() => setShowYearSelector(!showYearSelector)}
          >
            <span>{format(currentMonth, 'yyyy년')}</span>
            <span className="year-arrow">▼</span>
          </button>
          {showYearSelector && (
            <div className="year-selector">
              {years.map((year) => (
                <button
                  key={year}
                  className={`year-button ${currentYear === year ? 'active' : ''}`}
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="month-selector">
          {months.map((month, index) => (
            <button
              key={index}
              className={`month-button ${currentMonthIndex === index ? 'active' : ''}`}
              onClick={() => handleMonthChange(index)}
            >
              {month}
            </button>
          ))}
        </div>
        <div className="calendar-footer">
          <span className="current-date-label">
            {format(currentMonth, 'yyyy년 MM월')}
          </span>
          <button onClick={goToToday} className="today-button">
            오늘
          </button>
        </div>
      </div>

      <div className="month-calendar-grid">
        <div className="month-calendar-week-header">
          {dayNames.map((day, idx) => (
            <div 
              key={day} 
              className={`day-header-item ${idx === 0 || idx === 6 ? 'weekend' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>

        {monthWeeks.map((week, weekIdx) => {
          // 현재 월의 날짜가 있는 주만 표시
          const hasCurrentMonthDay = week.some(day => isCurrentMonth(day));
          if (!hasCurrentMonthDay && weekIdx === monthWeeks.length - 1) {
            return null;
          }
          
          return (
            <div key={weekIdx} className="month-calendar-week">
              {week.map((day, dayIdx) => {
              const dayTasks = getTasksForDate(day);
              const dayEvents = getEventsForDate(day);
              const isSelected = formatDate(day) === formatDate(selectedDate);

              return (
                <div
                  key={`${weekIdx}-${dayIdx}-${format(day, 'yyyy-MM-dd')}`}
                  className={`month-calendar-day ${
                    !isCurrentMonth(day) ? 'other-month' : ''
                  } ${isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''} ${
                    isWeekend(day) && isCurrentMonth(day) ? 'weekend-day' : ''
                  } ${isHoliday(day) && isCurrentMonth(day) ? 'holiday' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-number">{format(day, 'd')}</div>
                  <div className="day-indicators">
                    {dayTasks.length > 0 && (
                      <div className="indicator task-indicator" title={`${dayTasks.length}개 업무`}>
                        🔹
                      </div>
                    )}
                    {dayEvents.length > 0 && (
                      <div className="indicator event-indicator" title={`${dayEvents.length}개 이벤트`}>
                        🔺
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}
