import { useState, useEffect, useCallback } from 'react';
import { getData, saveData } from '@/utils/storage';
import { generateUUID } from '@/utils/uuid';
import type { AppData, TaskBlock, RoutinePreset, ManagementBlock, Bookmark, CalendarEvent } from '@/types';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => getData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveData(data);
    }
  }, [data, isLoading]);

  const addTask = useCallback((task: Omit<TaskBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: TaskBlock = {
      ...task,
      id: generateUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask.id;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskBlock>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id),
    }));
  }, []);

  const addRoutinePreset = useCallback((preset: Omit<RoutinePreset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPreset: RoutinePreset = {
      ...preset,
      id: generateUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setData(prev => ({ ...prev, routinePresets: [...prev.routinePresets, newPreset] }));
    return newPreset.id;
  }, []);

  const updateRoutinePreset = useCallback((id: string, updates: Partial<RoutinePreset>) => {
    setData(prev => ({
      ...prev,
      routinePresets: prev.routinePresets.map(preset =>
        preset.id === id ? { ...preset, ...updates, updatedAt: Date.now() } : preset
      ),
    }));
  }, []);

  const deleteRoutinePreset = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      routinePresets: prev.routinePresets.filter(preset => preset.id !== id),
    }));
  }, []);

  const addManagementBlock = useCallback((block: Omit<ManagementBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBlock: ManagementBlock = {
      ...block,
      id: generateUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setData(prev => ({ ...prev, managementBlocks: [...prev.managementBlocks, newBlock] }));
    return newBlock.id;
  }, []);

  const updateManagementBlock = useCallback((id: string, updates: Partial<ManagementBlock>) => {
    setData(prev => ({
      ...prev,
      managementBlocks: prev.managementBlocks.map(block =>
        block.id === id ? { ...block, ...updates, updatedAt: Date.now() } : block
      ),
    }));
  }, []);

  const deleteManagementBlock = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      managementBlocks: prev.managementBlocks.filter(block => block.id !== id),
    }));
  }, []);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: generateUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setData(prev => ({ ...prev, bookmarks: [...prev.bookmarks, newBookmark] }));
    return newBookmark.id;
  }, []);

  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setData(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.map(bookmark =>
        bookmark.id === id ? { ...bookmark, ...updates, updatedAt: Date.now() } : bookmark
      ),
    }));
  }, []);

  const deleteBookmark = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(bookmark => bookmark.id !== id),
    }));
  }, []);

  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setData(prev => ({ ...prev, calendarEvents: [...prev.calendarEvents, newEvent] }));
    return newEvent.id;
  }, []);

  const updateCalendarEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(event =>
        event.id === id ? { ...event, ...updates, updatedAt: Date.now() } : event
      ),
    }));
  }, []);

  const deleteCalendarEvent = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter(event => event.id !== id),
    }));
  }, []);

  return {
    data,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    addRoutinePreset,
    updateRoutinePreset,
    deleteRoutinePreset,
    addManagementBlock,
    updateManagementBlock,
    deleteManagementBlock,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
  };
}

