export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 2. Top Center Glow (Hero Highlight) */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-50 mix-blend-multiply dark:mix-blend-screen" />

      {/* 3. Bottom Right Glow (Secondary Highlight) */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full opacity-40" />

      {/* 4. Top Left Glow (Tertiary Highlight) */}
      <div className="absolute left-0 top-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full opacity-40" />
    </div>
  );
}
