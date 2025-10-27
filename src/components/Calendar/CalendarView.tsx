import { useState, useEffect } from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { getWeekDays, formatDate, normalizeDate, isDateInRange } from '@/utils/date';
import type { TaskBlock, CalendarEvent } from '@/types';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  tasks: TaskBlock[];
  events: CalendarEvent[];
  showWeekend?: boolean;
  onShowWeekendChange?: (show: boolean) => void;
  onEditTask?: (task: TaskBlock) => void;
}

export function CalendarView({
  selectedDate,
  onDateChange,
  tasks,
  events,
  showWeekend: externalShowWeekend,
  onShowWeekendChange,
  onEditTask,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [internalShowWeekend, setInternalShowWeekend] = useState(false);
  
  // selectedDate가 변경되면 currentDate도 업데이트
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);
  
  const showWeekend = externalShowWeekend !== undefined ? externalShowWeekend : internalShowWeekend;
  const setShowWeekend = (value: boolean) => {
    if (onShowWeekendChange) {
      onShowWeekendChange(value);
    } else {
      setInternalShowWeekend(value);
    }
  };

  const weekDays = getWeekDays(currentDate);
  
  // 토/일요일 필터링
  const filteredWeekDays = showWeekend 
    ? weekDays 
    : weekDays.filter((day) => {
        const dayOfWeek = day.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0: 일요일, 6: 토요일
      });
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const filteredDayNames = showWeekend 
    ? dayNames 
    : dayNames.filter((_, idx) => idx !== 0 && idx !== 6); // 일, 토 제거

  const nextPeriod = () => {
    const newDate = addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const prevPeriod = () => {
    const newDate = subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const getTasksForDate = (date: Date): TaskBlock[] => {
    const dateStr = formatDate(date);
    
    return tasks.filter(task => {
      // task.date가 정확히 일치하는 경우
      if (task.date === dateStr) {
        return true;
      }
      
      // task.date와 startDate/deadline이 다른 경우에만 범위 체크
      if (task.date !== dateStr && (task.startDate || task.deadline)) {
        return isDateInRange(date, task.startDate || null, task.deadline || null);
      }
      
      return false;
    });
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={prevPeriod}>←</button>
        <h2>
          주간: {format(filteredWeekDays[0], 'yyyy-MM-dd')} ~ {format(filteredWeekDays[filteredWeekDays.length - 1], 'yyyy-MM-dd')}
        </h2>
        <button onClick={nextPeriod}>→</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>토/일</span>
          <button
            className={`weekend-toggle ${showWeekend ? 'active' : ''}`}
            onClick={() => setShowWeekend(!showWeekend)}
            title="토/일요일 표시"
          >
            <div className="toggle-slider"></div>
          </button>
        </div>
      </div>

      <div className="calendar-week">
        <div className="calendar-days">
          {filteredDayNames.map((day, idx) => (
            <div key={day} className="calendar-day">
              <div className="day-name">{day}</div>
              <div className="day-date">
                {format(filteredWeekDays[idx], 'dd')}
              </div>
              <div className="day-events">
                {getTasksForDate(filteredWeekDays[idx]).map(task => (
                  <div 
                    key={task.id} 
                    className="event task" 
                    title={task.title}
                    onDoubleClick={() => onEditTask && onEditTask(task)}
                    style={{ cursor: onEditTask ? 'pointer' : 'default' }}
                  >
                    {task.title}
                  </div>
                ))}
                {getEventsForDate(filteredWeekDays[idx]).map(event => (
                  <div
                    key={event.id}
                    className={`event ${event.isDeadline ? 'deadline' : ''}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


