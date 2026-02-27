export default function BlogLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-warm-gray">Loading article...</p>
      </div>
    </div>
  );
}
