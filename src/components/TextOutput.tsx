import { useState } from 'react';
import { format } from 'date-fns';
import type { TaskBlock, TextOutputOptions } from '@/types';

interface TextOutputProps {
  tasks: TaskBlock[];
}

export function TextOutput({ tasks }: TextOutputProps) {
  const [options, setOptions] = useState<TextOutputOptions>({
    excludeRoutine: false,
    excludeContent: false,
    startDate: '',
    endDate: '',
  });

  const generateText = () => {
    let filteredTasks = [...tasks];

    // 날짜 필터
    if (options.startDate || options.endDate) {
      filteredTasks = filteredTasks.filter(task => {
        if (options.startDate && task.date < options.startDate) return false;
        if (options.endDate && task.date > options.endDate) return false;
        return true;
      });
    }

    // 루틴 제외
    if (options.excludeRoutine) {
      filteredTasks = filteredTasks.filter(task => !task.isRoutine);
    }

    // 날짜 순 정렬
    filteredTasks.sort((a, b) => a.date.localeCompare(b.date));

    // 텍스트 생성
    const lines: string[] = [];

    filteredTasks.forEach(task => {
      const dateStr = format(new Date(task.date), 'yyyy-MM-dd');
      lines.push(`[${dateStr}] ${task.title}`);
      
      if (!options.excludeContent) {
        if (task.progress) {
          lines.push(`  진행 과정: ${task.progress}`);
        }
        if (task.reflection) {
          lines.push(`  회고: ${task.reflection}`);
        }
        if (task.deadline) {
          lines.push(`  마감일: ${task.deadline}`);
        }
        lines.push(`  카테고리: ${task.category === 'General' ? '일반' : task.category === 'Routine' ? '루틴' : '관리'}`);
        if (task.isRoutine) {
          lines.push(`  루틴 업무`);
        }
      }
      
      lines.push(''); // 빈 줄
    });

    return lines.join('\n');
  };

  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const text = generateText();
    setOutput(text);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className="text-output">
      <div className="section-header">
        <h2>텍스트 출력</h2>
      </div>

      <div className="output-options">
        <label>
          <input
            type="checkbox"
            checked={options.excludeRoutine}
            onChange={e => setOptions({ ...options, excludeRoutine: e.target.checked })}
          />
          루틴 업무 제외
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.excludeContent}
            onChange={e => setOptions({ ...options, excludeContent: e.target.checked })}
          />
          제목만 출력 (본문 제외)
        </label>
        <div className="date-range">
          <label>시작일:</label>
          <input
            type="date"
            value={options.startDate}
            onChange={e => setOptions({ ...options, startDate: e.target.value })}
          />
          <label>종료일:</label>
          <input
            type="date"
            value={options.endDate}
            onChange={e => setOptions({ ...options, endDate: e.target.value })}
          />
        </div>
        <button onClick={handleGenerate}>텍스트 생성</button>
      </div>

      {output && (
        <div className="output-preview">
          <div className="preview-header">
            <h3>미리보기</h3>
            <button onClick={handleCopy}>
              {copied ? '✓ 복사됨' : '클립보드 복사'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="output-text"
            rows={20}
          />
        </div>
      )}
    </div>
  );
}


