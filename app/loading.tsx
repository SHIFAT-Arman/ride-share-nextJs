import InfinityLoop from "@/components/ui/infinityLoop";

export default function Loading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#070b14] text-[#eef3fb]">
      <InfinityLoop className="h-12 w-20" />
    </div>
  );
}
