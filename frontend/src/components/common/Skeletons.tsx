export function FolderSkeleton() {
  return (
    <div className="skeleton-list">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 90}ms` }} />
      ))}
    </div>
  );
}
export function NoteSkeleton() {
  return (
    <div className="skeleton-list">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}