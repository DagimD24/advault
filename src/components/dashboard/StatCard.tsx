import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-full",
            trend.positive 
              ? "bg-lime-100 text-lime-700" 
              : "bg-red-100 text-red-700"
          )}>
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-moralana text-black">{value}</p>
      </div>
    </div>
  );
}
