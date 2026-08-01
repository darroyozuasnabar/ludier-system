// app/reportes/components/ReportSelector.tsx

"use client";

interface ReportSelectorProps {
  reports: { id: string; label: string; icon: string }[];
  selected: string;
  onChange: (id: string) => void;
}

const iconMap: Record<string, string> = {
  TrendingUp: "📈",
  BarChart3: "🏗️",
  FileText: "📄",
  Users: "👷",
  AlertTriangle: "⚠️",
  Calendar: "📝",
  Package: "📦",
};

export default function ReportSelector({ reports, selected, onChange }: ReportSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {reports.map((report) => (
        <button
          key={report.id}
          onClick={() => onChange(report.id)}
          className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
            selected === report.id
              ? "bg-gray-900 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span>{iconMap[report.icon] || "📊"}</span>
          {report.label}
        </button>
      ))}
    </div>
  );
}