import { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import { CalendarView } from './components/Calendar/CalendarView';
import { MonthCalendar } from './components/MonthCalendar';
import { WeeklyTaskList } from './components/WeeklyTaskList';
import { RoutinePresetManager } from './components/RoutinePresetManager';
import { BookmarkManager } from './components/BookmarkManager';
import { TextOutput } from './components/TextOutput';
import { EditTaskModal } from './components/TaskBlock/EditTaskModal';
import type { TaskBlock } from './types';

function App() {
  const {
    data,
    addTask,
    updateTask,
    deleteTask,
    addRoutinePreset,
    updateRoutinePreset,
    deleteRoutinePreset,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  } = useAppData();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'tasks' | 'presets' | 'bookmarks' | 'output'>('tasks');
  const [showWeekend, setShowWeekend] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskBlock | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>개인 성과 관리 웹앱</h1>
        <nav className="main-nav">
          <button
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            📅 업무 관리
          </button>
          <button
            className={activeTab === 'presets' ? 'active' : ''}
            onClick={() => setActiveTab('presets')}
          >
            🔄 루틴 프리셋
          </button>
          <button
            className={activeTab === 'output' ? 'active' : ''}
            onClick={() => setActiveTab('output')}
          >
            📤 텍스트 출력
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'tasks' && (
          <div className="tasks-layout-extended">
            <aside className="bookmarks-sidebar">
              <div className="sidebar-header">
                <h3>⭐ 즐겨찾기</h3>
              </div>
              <div className="sidebar-content">
                <BookmarkManager
                  bookmarks={data.bookmarks}
                  onCreate={addBookmark}
                  onUpdate={updateBookmark}
                  onDelete={deleteBookmark}
                />
              </div>
            </aside>
            <div className="main-content-area">
              <CalendarView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                tasks={data.tasks}
                events={data.calendarEvents}
                showWeekend={showWeekend}
                onShowWeekendChange={setShowWeekend}
                onEditTask={setEditingTask}
              />
              <WeeklyTaskList
                tasks={data.tasks}
                selectedDate={selectedDate}
                routinePresets={data.routinePresets}
                onCreateTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                showWeekend={showWeekend}
                onShowWeekendChange={setShowWeekend}
              />
            </div>
            <aside className="calendar-sidebar">
              <MonthCalendar
                selectedDate={selectedDate}
                tasks={data.tasks}
                events={data.calendarEvents}
                onDateClick={setSelectedDate}
              />
            </aside>
          </div>
        )}

        {activeTab === 'presets' && (
          <RoutinePresetManager
            presets={data.routinePresets}
            onCreate={addRoutinePreset}
            onUpdate={updateRoutinePreset}
            onDelete={deleteRoutinePreset}
          />
        )}

        {activeTab === 'output' && (
          <TextOutput tasks={data.tasks} />
        )}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onUpdate={updateTask}
          />
        )}
      </main>
    </div>
  );
}

export default App;


