import { useState, useEffect } from 'react';
import type { Bookmark } from '@/types';

const EXPANDED_FOLDERS_KEY = 'bookmark-expanded-folders';

interface BookmarkManagerProps {
  bookmarks: Bookmark[];
  onCreate: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Bookmark>) => void;
  onDelete: (id: string) => void;
}

export function BookmarkManager({
  bookmarks,
  onCreate,
  onUpdate,
  onDelete,
}: BookmarkManagerProps) {
  // localStorage에서 확장된 폴더 상태 로드
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(EXPANDED_FOLDERS_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load expanded folders:', error);
    }
    return new Set();
  });
  
  // 확장 상태 변경 시 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_FOLDERS_KEY, JSON.stringify(Array.from(expandedFolders)));
    } catch (error) {
      console.error('Failed to save expanded folders:', error);
    }
  }, [expandedFolders]);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingType, setCreatingType] = useState<'folder' | 'link'>('link');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    parentId: '',
    isFolder: false,
  });

  const folders = bookmarks.filter(b => b.isFolder);
  const items = bookmarks.filter(b => !b.isFolder);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getChildren = (parentId?: string) => {
    return bookmarks.filter(b => !b.isFolder && b.parentId === parentId);
  };

  const getFolderChildren = (folderId: string) => {
    return bookmarks.filter(b => b.parentId === folderId);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || (!formData.url && !formData.isFolder)) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    if (!formData.isFolder && !isValidUrl(formData.url)) {
      alert('올바른 URL을 입력해주세요.');
      return;
    }

    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onCreate(formData);
    }

    setFormData({ name: '', url: '', parentId: '', isFolder: false });
    setIsCreating(false);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return /^\\\\/.test(url) || /^\/{2}/.test(url); // 네트워크 경로 허용
    }
  };

  const handleClick = (bookmark: Bookmark) => {
    if (bookmark.isFolder) {
      toggleFolder(bookmark.id);
    } else {
      window.open(bookmark.url, '_blank');
    }
  };

  const handleDragStart = (e: React.DragEvent, bookmark: Bookmark) => {
    e.stopPropagation();
    setDraggedBookmark(bookmark);
  };

  const handleDragOver = (e: React.DragEvent, folderId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (folderId) {
      setDragOverFolder(folderId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolderId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedBookmark) return;

    // 같은 위치로 드롭하는 경우 무시
    if (draggedBookmark.parentId === targetFolderId) {
      setDraggedBookmark(null);
      setDragOverFolder(null);
      return;
    }

    // 자기 자신이나 하위 폴더에 드롭하는 경우 무시
    if (targetFolderId) {
      const isSelfOrChild = (folderId: string): boolean => {
        if (folderId === draggedBookmark.id) return true;
        const folder = bookmarks.find(b => b.id === folderId);
        if (!folder) return false;
        if (folder.parentId === draggedBookmark.id) return true;
        return isSelfOrChild(folder.parentId || '');
      };
      if (isSelfOrChild(targetFolderId)) {
        setDraggedBookmark(null);
        setDragOverFolder(null);
        return;
      }
    }

    // 자기 자신이나 하위 아이템에 드롭하는 경우 무시
    if (targetFolderId) {
      // 폴더를 자기 자신의 하위로 드롭하는 것을 방지
      if (draggedBookmark.isFolder && draggedBookmark.id === targetFolderId) {
        setDraggedBookmark(null);
        setDragOverFolder(null);
        return;
      }
      
      // 폴더가 자기 자신이나 부모로 이동하는 것을 방지
      if (draggedBookmark.isFolder) {
        const isParentFolder = (folderId: string): boolean => {
          const folder = bookmarks.find(b => b.id === folderId);
          if (!folder) return false;
          if (folder.parentId === draggedBookmark.id) return true;
          if (folder.parentId) return isParentFolder(folder.parentId);
          return false;
        };
        if (isParentFolder(targetFolderId)) {
          setDraggedBookmark(null);
          setDragOverFolder(null);
          return;
        }
      }
    }

    // 드롭 처리
    onUpdate(draggedBookmark.id, { parentId: targetFolderId || undefined });
    
    setDraggedBookmark(null);
    setDragOverFolder(null);
  };

  const renderBookmark = (bookmark: Bookmark, level: number = 0) => {
    const isExpanded = expandedFolders.has(bookmark.id);
    const children = bookmark.isFolder ? getFolderChildren(bookmark.id) : [];
    const isDragging = draggedBookmark?.id === bookmark.id;
    const isDragOver = dragOverFolder === bookmark.id;

    return (
      <div 
        key={bookmark.id} 
        className="bookmark-row"
        draggable={true}
        onDragStart={(e) => handleDragStart(e, bookmark)}
      >
        <div className="bookmark-hierarchy">
          {level > 0 && <div className="hierarchy-line"></div>}
          <div 
            className={`bookmark-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              if (!isDragging) {
                handleDragOver(e, bookmark.isFolder ? bookmark.id : undefined);
              }
            }}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              if (!isDragging) {
                handleDrop(e, bookmark.isFolder ? bookmark.id : undefined);
              }
            }}
          >
            <span
              className={bookmark.isFolder ? 'bookmark-folder' : 'bookmark-link'}
              onClick={() => handleClick(bookmark)}
            >
              {bookmark.isFolder && (isExpanded ? '▼' : '▶')} {bookmark.name}
            </span>
            <div className="bookmark-actions">
              <button 
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(bookmark);
                }}
                title="수정"
                onMouseDown={(e) => e.stopPropagation()}
              >
                ✏️
              </button>
              <button 
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(bookmark.id);
                }}
                title="삭제"
                onMouseDown={(e) => e.stopPropagation()}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
        {bookmark.isFolder && isExpanded && (
          <div className="bookmark-children">
            {children.map(child => renderBookmark(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setFormData({
      name: bookmark.name,
      url: bookmark.url,
      parentId: bookmark.parentId || '',
      isFolder: bookmark.isFolder,
    });
  };

  const cancel = () => {
    setFormData({ name: '', url: '', parentId: '', isFolder: false });
    setIsCreating(false);
    setEditingId(null);
  };

  const startAdding = (type: 'folder' | 'link') => {
    setCreatingType(type);
    setFormData({
      name: '',
      url: '',
      parentId: '',
      isFolder: type === 'folder',
    });
    setIsCreating(true);
  };

  return (
    <div className="bookmark-manager">
      <div className="bookmark-toolbar">
        <button 
          className={`bookmark-btn-tab ${creatingType === 'folder' ? 'active' : ''}`}
          onClick={() => startAdding('folder')}
        >
          📁 폴더 추가
        </button>
        <button 
          className={`bookmark-btn-tab ${creatingType === 'link' ? 'active' : ''}`}
          onClick={() => startAdding('link')}
        >
          🔗 링크 추가
        </button>
      </div>

      {isCreating || editingId ? (
        <div className="bookmark-form-compact">
          <input
            type="text"
            placeholder="이름 *"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          {!formData.isFolder && (
            <input
              type="text"
              placeholder="URL *"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
            />
          )}
          <select
            value={formData.parentId}
            onChange={e => setFormData({ ...formData, parentId: e.target.value })}
          >
            <option value="">루트</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <div className="form-actions-compact">
            <button onClick={handleSubmit}>저장</button>
            <button onClick={cancel}>취소</button>
          </div>
        </div>
      ) : null}

      <div 
        className="bookmark-list"
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, undefined)}
      >
        {bookmarks.filter(b => !b.parentId).length === 0 ? (
          <div className="empty-bookmarks">즐겨찾기를 추가해보세요</div>
        ) : (
          bookmarks.filter(b => !b.parentId).map(bookmark => renderBookmark(bookmark))
        )}
      </div>
    </div>
  );
}


