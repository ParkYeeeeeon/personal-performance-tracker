import { getWeekDays, formatDate, normalizeDate, isDateInRange } from '@/utils/date';
import { format } from 'date-fns';
import type { TaskBlock } from '@/types';
import { TaskBlockItem } from './TaskBlock/TaskBlockItem';
import { CreateTaskModal } from './TaskBlock/CreateTaskModal';
import { EditTaskModal } from './TaskBlock/EditTaskModal';
import { useState } from 'react';

interface WeeklyTaskListProps {
  tasks: TaskBlock[];
  selectedDate: Date;
  routinePresets: any[];
  onCreateTask: (task: Omit<TaskBlock, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<TaskBlock>) => void;
  onDeleteTask: (id: string) => void;
  showWeekend?: boolean;
  onShowWeekendChange?: (show: boolean) => void;
}

export function WeeklyTaskList({
  tasks,
  selectedDate,
  routinePresets,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  showWeekend: externalShowWeekend,
  onShowWeekendChange,
}: WeeklyTaskListProps) {
  const [internalShowWeekend, setInternalShowWeekend] = useState(false);
  const weekDays = getWeekDays(selectedDate);

  const handleCopyTask = (task: TaskBlock) => {
    onCreateTask({
      ...task,
      date: formatDate(selectedDate),
    });
  };
  
  const showWeekend = externalShowWeekend !== undefined ? externalShowWeekend : internalShowWeekend;
  const setShowWeekend = (value: boolean) => {
    if (onShowWeekendChange) {
      onShowWeekendChange(value);
    } else {
      setInternalShowWeekend(value);
    }
  };
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskBlock | null>(null);
  const [selectedDay, setSelectedDay] = useState(formatDate(selectedDate));

  // 토/일요일 필터링
  const filteredWeekDays = showWeekend 
    ? weekDays 
    : weekDays.filter((day, index) => {
        const dayOfWeek = day.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0: 일요일, 6: 토요일
      });

  const tasksByDate = filteredWeekDays.reduce((acc, day) => {
    const dateStr = formatDate(day);
    
    acc[dateStr] = tasks.filter(task => {
      // task.date가 정확히 일치하는 경우
      if (task.date === dateStr) {
        return true;
      }
      
      // task.date는 다르지만 startDate/deadline 범위에 포함되는 경우
      if (task.startDate || task.deadline) {
        const inRange = isDateInRange(day, task.startDate || null, task.deadline || null);
        if (inRange) {
          return true;
        }
      }
      
      return false;
    });
    return acc;
  }, {} as Record<string, TaskBlock[]>);

  const handleCreateTask = () => {
    setSelectedDay(formatDate(selectedDate));
    setShowCreateModal(true);
  };

  return (
    <div className="weekly-task-list">
      <div className="section-header">
        <h2>주간 업무 리스트</h2>
        <div className="section-actions">
          <div className="weekend-toggle-wrapper">
            <span className="weekend-toggle-label">토/일</span>
            <button 
              className={`weekend-toggle ${showWeekend ? 'active' : ''}`}
              onClick={() => setShowWeekend(!showWeekend)}
              title="토/일요일 표시"
            >
              <div className="toggle-slider"></div>
            </button>
          </div>
          <button onClick={handleCreateTask}>+ 업무 추가</button>
        </div>
      </div>

      <div className="task-list-by-date">
        {filteredWeekDays.map(day => {
          const dateStr = formatDate(day);
          const dayTasks = tasksByDate[dateStr] || [];

          return (
            <div key={dateStr} className="day-section">
              <div className="day-header">
                <h3>{format(day, 'yyyy-MM-dd (EEE)', { weekStartsOn: 0 })}</h3>
                <span className="task-count">{dayTasks.length}개</span>
              </div>
              <div className="tasks-container">
                {dayTasks.map(task => (
                  <TaskBlockItem
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={onDeleteTask}
                    onCopy={handleCopyTask}
                  />
                ))}
                {dayTasks.length === 0 && (
                  <div className="no-tasks">등록된 업무가 없습니다</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateTask}
          routinePresets={routinePresets}
          date={selectedDay}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={onUpdateTask}
        />
      )}
    </div>
  );
}

