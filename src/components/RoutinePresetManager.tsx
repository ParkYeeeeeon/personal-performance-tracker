import { useState } from 'react';
import type { RoutinePreset } from '@/types';

interface RoutinePresetManagerProps {
  presets: RoutinePreset[];
  onCreate: (preset: Omit<RoutinePreset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<RoutinePreset>) => void;
  onDelete: (id: string) => void;
}

export function RoutinePresetManager({
  presets,
  onCreate,
  onUpdate,
  onDelete,
}: RoutinePresetManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    defaultTitle: '',
    defaultProgress: '',
    defaultReflection: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.defaultTitle.trim()) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onCreate(formData);
    }

    setFormData({ name: '', defaultTitle: '', defaultProgress: '', defaultReflection: '' });
    setIsCreating(false);
  };

  const startEditing = (preset: RoutinePreset) => {
    setEditingId(preset.id);
    setFormData({
      name: preset.name,
      defaultTitle: preset.defaultTitle,
      defaultProgress: preset.defaultProgress || '',
      defaultReflection: preset.defaultReflection || '',
    });
  };

  const cancel = () => {
    setFormData({ name: '', defaultTitle: '', defaultProgress: '', defaultReflection: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="routine-preset-manager">
      <div className="section-header">
        <h2>루틴 프리셋 관리</h2>
        <button onClick={() => setIsCreating(true)}>+ 프리셋 추가</button>
      </div>

      {isCreating || editingId ? (
        <div className="preset-form">
          <input
            type="text"
            placeholder="프리셋 이름 *"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="기본 제목 *"
            value={formData.defaultTitle}
            onChange={e => setFormData({ ...formData, defaultTitle: e.target.value })}
          />
          <textarea
            placeholder="기본 진행 과정"
            value={formData.defaultProgress}
            onChange={e => setFormData({ ...formData, defaultProgress: e.target.value })}
            rows={3}
          />
          <textarea
            placeholder="기본 회고"
            value={formData.defaultReflection}
            onChange={e => setFormData({ ...formData, defaultReflection: e.target.value })}
            rows={3}
          />
          <div className="form-actions">
            <button onClick={handleSubmit}>저장</button>
            <button onClick={cancel}>취소</button>
          </div>
        </div>
      ) : null}

      <div className="preset-list">
        {presets.map(preset => (
          <div key={preset.id} className="preset-item">
            <h3>{preset.name}</h3>
            <p><strong>제목:</strong> {preset.defaultTitle}</p>
            {preset.defaultProgress && (
              <p><strong>진행 과정:</strong> {preset.defaultProgress}</p>
            )}
            {preset.defaultReflection && (
              <p><strong>회고:</strong> {preset.defaultReflection}</p>
            )}
            <div className="preset-actions">
              <button onClick={() => startEditing(preset)}>수정</button>
              <button onClick={() => onDelete(preset.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


