import { GradesSkeleton } from "@/components/grades/GradesSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <GradesSkeleton />
    </main>
  );
}
