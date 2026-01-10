import { Brain } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Brain className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 className="text-xl text-primary tracking-wide">TESTEM</h1>
      </div>
    </div>
  );
}
