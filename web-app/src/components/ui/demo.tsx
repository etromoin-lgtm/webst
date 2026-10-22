import { Component } from "@/components/ui/morphing-island-navbar";

export default function DemoOne() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-neutral-100 p-6 transition-colors duration-200 dark:bg-neutral-950">
      <Component />
    </div>
  );
}
