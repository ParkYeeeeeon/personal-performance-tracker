// 업무 카테고리
export type TaskCategory = 'General' | 'Routine' | 'Management';

// 업무 블록
export interface TaskBlock {
  id: string;
  title: string;
  startDate?: string; // YYYY-MM-DD
  deadline?: string; // YYYY-MM-DD
  progress?: string;
  reflection?: string;
  isRoutine: boolean;
  category: TaskCategory;
  date: string; // YYYY-MM-DD
  createdAt: number;
  updatedAt: number;
}

// 루틴 업무 프리셋
export interface RoutinePreset {
  id: string;
  name: string;
  defaultTitle: string;
  defaultProgress?: string;
  defaultReflection?: string;
  createdAt: number;
  updatedAt: number;
}

// 관리 업무 특이사항
export interface ManagementBlock {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  updatedAt: number;
}

// 즐겨찾기/네트워크 경로
export interface Bookmark {
  id: string;
  name: string;
  url: string;
  parentId?: string;
  isFolder: boolean;
  createdAt: number;
  updatedAt: number;
}

// 캘린더 이벤트
export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  isDeadline: boolean;
  createdAt: number;
  updatedAt: number;
}

// 앱 전체 데이터
export interface AppData {
  tasks: TaskBlock[];
  routinePresets: RoutinePreset[];
  managementBlocks: ManagementBlock[];
  bookmarks: Bookmark[];
  calendarEvents: CalendarEvent[];
}

// 텍스트 출력 옵션
export interface TextOutputOptions {
  excludeRoutine: boolean;
  excludeContent: boolean;
  startDate?: string;
  endDate?: string;
}


