import { Folder } from '@/types/exam';
import { cn } from '@/lib/utils';
import { Folder as FolderIcon, ChevronRight } from 'lucide-react';

interface FolderSidebarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export const FolderSidebar = ({
  folders,
  selectedFolderId,
  onFolderSelect,
}: FolderSidebarProps) => {
  return (
    <aside className="w-64 bg-card border-r border-border h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Folders</h2>
      </div>
      <nav className="p-2">
        <button
          onClick={() => onFolderSelect(null)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
            selectedFolderId === null
              ? 'bg-primary/10 text-primary'
              : 'text-foreground hover:bg-accent'
          )}
        >
          <FolderIcon className="w-4 h-4" />
          <span className="text-sm font-medium">All Documents</span>
        </button>
        
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onFolderSelect(folder.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
              selectedFolderId === folder.id
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-accent'
            )}
          >
            <FolderIcon className="w-4 h-4" />
            <span className="text-sm font-medium flex-1">{folder.name}</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        ))}
      </nav>
    </aside>
  );
};
