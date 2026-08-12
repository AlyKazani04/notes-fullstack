import {
  FolderPlus,
  Inbox,
  LogOut,
  Pencil,
  SettingsIcon,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FolderSkeleton } from "../common/Skeletons";
import { folderColor } from "../../utils/helpers";
import type { Folder, User } from "../../types";
import type { CSSProperties, FormEvent } from "react";

interface SidebarProps {
  user: User | null;
  folders: Folder[];
  foldersLoading: boolean;
  selectedFolderId: string | null | undefined;
  onSelectFolder: (id: string | undefined) => void;
  onCreateFolder: (name: string) => Promise<void>;
  onRenameFolder: (id: string, name: string) => Promise<void>;
  onDeleteFolder: (id: string) => Promise<void>;
  onOpenSettings: () => void;
  onLogout: () => Promise<void>;
  noteCounts: Record<string, number>;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  user,
  folders,
  foldersLoading,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onOpenSettings,
  onLogout,
  noteCounts,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState<string>("");
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>("");
  const addInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (addingFolder) addInputRef.current?.focus();
  }, [addingFolder]);

  function commitNewFolder() {
    if (!newFolderName.trim()) {
      setAddingFolder(false);
      return;
    }
    onCreateFolder(newFolderName.trim());
    setNewFolderName("");
    setAddingFolder(false);
  }

  function submitNewFolder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commitNewFolder();
  }

  function submitRename(id: string) {
    if (renameValue.trim()) onRenameFolder(id, renameValue.trim());
    setRenamingId("");
  }

  const initials = (user?.username || "?").slice(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-scrim" onClick={onCloseMobile} />
      <div className="sidebar-inner">
        <div className="brand-row">
          <span className="brand-mark">NOTES</span>
        </div>

        <button className="profile-widget" onClick={onOpenSettings}>
          <span className="avatar">{initials}</span>
          <span className="profile-text">
            <span className="profile-name">{user?.username}</span>
            <span className="profile-email">{user?.email}</span>
          </span>
          <SettingsIcon size={16} className="profile-gear" />
        </button>

        <nav className="folder-nav">
          <button
            className={`nav-row all-notes ${selectedFolderId === undefined ? "active" : ""}`}
            onClick={() => onSelectFolder(undefined)}
          >
            <Inbox size={15} />
            <span>All notes</span>
          </button>

          <div className="nav-label">Folders</div>

          {foldersLoading ? (
            <FolderSkeleton />
          ) : folders.length === 0 && !addingFolder ? (
            <div className="empty-inline">No folders yet.</div>
          ) : (
            folders.map((f) => (
              <div key={f.id} className="folder-tab-wrap">
                {renamingId === f.id ? (
                  <form
                    className="rename-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitRename(f.id);
                    }}
                  >
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => submitRename(f.id)}
                      onKeyDown={(e) => e.key === "Escape" && setRenamingId("")}
                    />
                  </form>
                ) : (
                  <button
                    className={`nav-row folder-tab ${selectedFolderId === f.id ? "active" : ""}`}
                    style={
                      { "--folder-color": folderColor(f.id) } as CSSProperties
                    }
                    onClick={() => onSelectFolder(f.id)}
                  >
                    <span className="folder-dot" />
                    <span className="folder-name">{f.name}</span>
                    <span className="folder-count">
                      {noteCounts[f.id] || 0}
                    </span>
                    <span className="folder-actions">
                      <span
                        role="button"
                        tabIndex={0}
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(f.id);
                          setRenameValue(f.name);
                        }}
                      >
                        <Pencil size={12} />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        className={`${confirmDeleteId === f.id ? "icon-btn danger-confirm" : "icon-btn"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirmDeleteId === f.id) {
                            onDeleteFolder(f.id);
                            setConfirmDeleteId("");
                          } else {
                            setConfirmDeleteId(f.id);
                            setTimeout(
                              () =>
                                setConfirmDeleteId((cur: string) =>
                                  cur === f.id ? "" : cur,
                                ),
                              2800,
                            );
                          }
                        }}
                      >
                        <Trash2 size={12} />
                      </span>
                    </span>
                  </button>
                )}
              </div>
            ))
          )}

          {addingFolder ? (
            <form className="new-folder-form" onSubmit={submitNewFolder}>
              <input
                ref={addInputRef}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={commitNewFolder}
                onKeyDown={(e) => e.key === "Escape" && setAddingFolder(false)}
                placeholder="Folder name"
              />
            </form>
          ) : (
            <button
              className="nav-row new-folder-btn"
              onClick={() => setAddingFolder(true)}
            >
              <FolderPlus size={15} />
              <span>New folder</span>
            </button>
          )}
        </nav>

        <button className="nav-row logout-row" onClick={onLogout}>
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
