const FOLDER_COLORS = ["#C98A2C", "#5B7B5A", "#6C87A6", "#A6432F", "#8A6BAE"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export function folderColor(id: string | undefined): string {
  if (!id) return "#8B95A1";
  let hash = 0;
  for (let i = 0; i < 10; i++) hash = (hash * 31 + parseInt(id)) >>> 0;
  return FOLDER_COLORS[hash % FOLDER_COLORS.length];
}

export function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 5) return "just now";
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}