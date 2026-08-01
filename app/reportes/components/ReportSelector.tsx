// app/reportes/components/ReportSelector.tsx
"use client";

import {
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  AlertTriangle,
  Calendar,
  Package,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

interface ReportSelectorProps {
  reports: { id: string; label: string; icon: string }[];
  selected: string;
  onChange: (id: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  AlertTriangle,
  Calendar,
  Package,
};

export default function ReportSelector({ reports, selected, onChange }: ReportSelectorProps) {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex gap-1 min-w-max px-0.5">
        {reports.map((report) => {
          const Icon = iconMap[report.icon] || LayoutGrid;
          const isSelected = selected === report.id;

          return (
            <button
              key={report.id}
              type="button"
              onClick={() => onChange(report.id)}
              aria-current={isSelected}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {report.label}
              <span
                className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors ${
                  isSelected ? "bg-gray-900" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}