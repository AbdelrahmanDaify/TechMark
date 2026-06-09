import { cn } from "@/lib/utils";
type Size = "sm" | "md" | "lg";
type LoadingSpinnerProps = {
  size?: Size;
};

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary",
          size == "sm" && "size-4",
          size == "md" && "size-6",
          size == "lg" && "size-8"
        )}
      ></div>
    </div>
  );
}
