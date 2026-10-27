export function Spinner() {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className="h-6 w-6 animate-spin border-rule border-ink bg-signal" />
    </div>
  );
}
