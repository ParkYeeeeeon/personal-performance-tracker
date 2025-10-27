import { useState, useEffect } from 'react';
import type { TaskBlock, TaskCategory } from '@/types';

interface EditTaskModalProps {
  task: TaskBlock | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TaskBlock>) => void;
}

export function EditTaskModal({ task, onClose, onUpdate }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState('');
  const [reflection, setReflection] = useState('');
  const [isRoutine, setIsRoutine] = useState(false);
  const [category, setCategory] = useState<TaskCategory>('General');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStartDate(task.startDate || '');
      setDeadline(task.deadline || '');
      setProgress(task.progress || '');
      setReflection(task.reflection || '');
      setIsRoutine(task.isRoutine);
      setCategory(task.category);
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    onUpdate(task.id, {
      title,
      startDate,
      deadline,
      progress,
      reflection,
      isRoutine,
      category,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>업무 블록 수정</h2>

        <div className="form-group">
          <label>제목 <span className="required">*</span></label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>마감일</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>진행 과정</label>
          <textarea
            value={progress}
            onChange={e => setProgress(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>회고</label>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>루틴 업무</span>
            <button
              className={`weekend-toggle ${isRoutine ? 'active' : ''}`}
              onClick={() => setIsRoutine(!isRoutine)}
              type="button"
            >
              <div className="toggle-slider"></div>
            </button>
          </label>
        </div>

        <div className="form-group">
          <label>카테고리</label>
          <select value={category} onChange={e => setCategory(e.target.value as TaskCategory)}>
            <option value="General">일반 업무</option>
            <option value="Routine">루틴 업무</option>
            <option value="Management">관리 업무</option>
          </select>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>저장</button>
        </div>
      </div>
    </div>
  );
}


