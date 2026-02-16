export function PostsSearch({ onChange }: { onChange: (_value: string) => void }) {
  return (
    <div className="relative max-w-lg">
      <input
        aria-label="Search posts"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts"
        className="vscode-input"
      />
    </div>
  )
}
