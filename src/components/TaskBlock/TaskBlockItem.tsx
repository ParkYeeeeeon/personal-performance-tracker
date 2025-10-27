import type { TaskBlock } from '@/types';

interface TaskBlockItemProps {
  task: TaskBlock;
  onEdit: (task: TaskBlock) => void;
  onDelete: (id: string) => void;
  onCopy?: (task: TaskBlock) => void;
}

export function TaskBlockItem({ task, onEdit, onDelete, onCopy }: TaskBlockItemProps) {
  const categoryLabels = {
    General: '일반',
    Routine: '루틴',
    Management: '관리',
  };

  const categoryColors = {
    General: '#4CAF50',
    Routine: '#2196F3',
    Management: '#FF9800',
  };

  const handleDoubleClick = () => {
    onEdit(task);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy(task);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className={`task-block ${task.isRoutine ? 'routine' : ''}`} onDoubleClick={handleDoubleClick}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          {onCopy && (
            <button className="icon-btn" onClick={handleCopy} title="복사">
              📋
            </button>
          )}
          <button className="icon-btn" onClick={handleEdit} title="수정">
            ✏️
          </button>
          <button className="icon-btn" onClick={handleDelete} title="삭제">
            🗑️
          </button>
        </div>
      </div>
      
      <div className="task-meta">
        <span className="category" style={{ color: categoryColors[task.category] }}>
          {categoryLabels[task.category]}
        </span>
        {task.startDate && (
          <span className="start-date">시작: {task.startDate}</span>
        )}
        {task.deadline && (
          <span className="deadline">마감: {task.deadline}</span>
        )}
        {task.isRoutine && <span className="routine-badge">루틴</span>}
      </div>

      {task.progress && (
        <div className="task-content">
          <strong>진행 과정:</strong>
          <p>{task.progress}</p>
        </div>
      )}

      {task.reflection && (
        <div className="task-content">
          <strong>회고:</strong>
          <p>{task.reflection}</p>
        </div>
      )}
    </div>
  );
}


