import type { AppData } from '@/types';
import { mockData } from '@/mocks/data';

const STORAGE_KEY = 'personal-performance-tracker-data';

export function getData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 북마크 배열이 비어있거나 없으면 mock 데이터 사용
      if (!parsed.bookmarks || parsed.bookmarks.length === 0) {
        return { ...mockData };
      }
      return parsed;
    }
    // 로컬 스토리지에 데이터가 없으면 초기 mock 데이터 반환
    return { ...mockData };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return { ...mockData };
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
}

export function resetData(): void {
  localStorage.removeItem(STORAGE_KEY);
}


