import { useState } from 'react';
import type { TaskBlock, RoutinePreset, TaskCategory } from '@/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Omit<TaskBlock, 'id' | 'createdAt' | 'updatedAt'>) => void;
  routinePresets: RoutinePreset[];
  date: string;
}

export function CreateTaskModal({ isOpen, onClose, onCreate, routinePresets, date }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState('');
  const [reflection, setReflection] = useState('');
  const [isRoutine, setIsRoutine] = useState(false);
  const [category, setCategory] = useState<TaskCategory>('General');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  if (!isOpen) return null;

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId) {
      const preset = routinePresets.find(p => p.id === presetId);
      if (preset) {
        setTitle(preset.defaultTitle);
        setProgress(preset.defaultProgress || '');
        setReflection(preset.defaultReflection || '');
        setIsRoutine(true);
        setCategory('Routine');
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    // 시작일/마감일이 공백이면 오늘 날짜로 설정
    const finalStartDate = startDate.trim() || date;
    const finalDeadline = deadline.trim() || date;

    // task.date는 시작일이 있으면 시작일로, 없으면 현재 선택된 날짜로
    const taskDate = startDate.trim() || date;

    onCreate({
      title,
      startDate: finalStartDate,
      deadline: finalDeadline,
      progress,
      reflection,
      isRoutine,
      category,
      date: taskDate,
    });

    // Reset
    setTitle('');
    setStartDate('');
    setDeadline('');
    setProgress('');
    setReflection('');
    setIsRoutine(false);
    setCategory('General');
    setSelectedPresetId('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>업무 블록 생성</h2>
        
        <div className="form-group">
          <label>루틴 프리셋</label>
          <select value={selectedPresetId} onChange={e => handlePresetChange(e.target.value)}>
            <option value="">프리셋 선택 (선택사항)</option>
            {routinePresets.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>제목 <span className="required">*</span></label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="업무 제목"
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
            placeholder="진행 과정을 입력하세요"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>회고</label>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="회고를 입력하세요"
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
          <button onClick={handleSubmit}>생성</button>
        </div>
      </div>
    </div>
  );
}


