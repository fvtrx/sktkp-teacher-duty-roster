import { CardContent } from "@src/components/ui/card";
import { DutyStation, DutyStations } from "@src/types";
import React from "react";

// Available color schemes based on Tailwind classes
type ColorScheme = "blue" | "green" | "indigo" | "orange" | "purple";

interface TeacherBadgeProps {
  teacher: string;
  colorScheme: ColorScheme;
}

interface TeacherSelectionDisplayProps {
  selected: string | string[] | undefined;
  colorScheme: ColorScheme;
}

interface DutyRosterTableProps {
  rosterData: DutyStations;
  reportTeacher: string | undefined;
}

interface SectionConfig {
  title: string;
  stations: DutyStation[];
  colorScheme: ColorScheme;
  hoverClass: string;
}

// Component to render a teacher badge with appropriate styling based on section
const TeacherBadge: React.FC<TeacherBadgeProps> = ({
  teacher,
  colorScheme,
}) => {
  // Instead of string interpolation, use a mapping for Tailwind classes
  const bgColorClass = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    indigo: "bg-indigo-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100",
  }[colorScheme];

  const textColorClass = {
    blue: "text-blue-800",
    green: "text-green-800",
    indigo: "text-indigo-800",
    orange: "text-orange-800",
    purple: "text-purple-800",
  }[colorScheme];

  return (
    <span
      className={`${bgColorClass} ${textColorClass} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
    >
      {teacher}
    </span>
  );
};

// Component to render teacher selection (for display-only table)
const TeacherSelectionDisplay: React.FC<TeacherSelectionDisplayProps> = ({
  selected,
  colorScheme,
}) => {
  if (!selected) {
    return <span className="text-gray-400 italic">Belum dipilih</span>;
  }

  if (Array.isArray(selected)) {
    const validTeachers = selected.filter(Boolean);

    return validTeachers.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {validTeachers.map((teacher, idx) => (
          <TeacherBadge key={idx} teacher={teacher} colorScheme={colorScheme} />
        ))}
      </div>
    ) : (
      <span className="text-gray-400 italic">Belum dipilih</span>
    );
  }

  return <TeacherBadge teacher={selected} colorScheme={colorScheme} />;
};

// Component to render the display-only table
const DutyRosterTable: React.FC<DutyRosterTableProps> = ({
  rosterData,
  reportTeacher,
}) => {
  const getHoverColorClass = (colorScheme: ColorScheme): string => {
    const colorMap: Record<ColorScheme, string> = {
      blue: "hover:bg-blue-50",
      green: "hover:bg-green-50",
      indigo: "hover:bg-indigo-50",
      orange: "hover:bg-orange-50",
      purple: "hover:bg-purple-50",
    };
    return colorMap[colorScheme];
  };
  const sectionConfigs: SectionConfig[] = [
    {
      title: "PAGI",
      stations: rosterData.pagi,
      colorScheme: "blue",
      hoverClass: getHoverColorClass("blue"),
    },
    {
      title: "REHAT",
      stations: rosterData.rehat,
      colorScheme: "green",
      hoverClass: getHoverColorClass("green"),
    },
    {
      title: "PULANG (TAHAP 1)",
      stations: rosterData.pulang.tahap1,
      colorScheme: "indigo",
      hoverClass: getHoverColorClass("indigo"),
    },
    {
      title: "PULANG (TAHAP 2)",
      stations: rosterData.pulang.tahap2,
      colorScheme: "orange",
      hoverClass: getHoverColorClass("orange"),
    },
  ];

  // Type-safe color mapping functions for styling
  const getTextColorClass = (colorScheme: ColorScheme): string => {
    const colorMap: Record<ColorScheme, string> = {
      blue: "text-blue-600",
      green: "text-green-600",
      indigo: "text-indigo-600",
      orange: "text-orange-600",
      purple: "text-purple-600",
    };
    return colorMap[colorScheme];
  };

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <div className="table-container">
          <table className="min-w-full bg-white table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu/Buku Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tugasan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guru Bertugas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sectionConfigs.map((config) =>
                config.stations.map((station, index) => (
                  <tr
                    key={`${config.title}-${station.id}`}
                    className={`${config.hoverClass} transition-colors`}
                  >
                    {index === 0 && (
                      <td
                        className={`px-6 py-4 font-medium ${getTextColorClass(
                          config.colorScheme
                        )} align-top`}
                        rowSpan={config.stations.length}
                      >
                        📌 {config.title}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {station.label}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <TeacherSelectionDisplay
                        selected={station.selected}
                        colorScheme={config.colorScheme}
                      />
                    </td>
                  </tr>
                ))
              )}

              {/* Buku Laporan */}
              <tr className="hover:bg-purple-50 transition-colors">
                <td className="px-6 py-4 font-medium text-purple-600">
                  📌 BUKU LAPORAN
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Guru Bertugas
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <TeacherSelectionDisplay
                    selected={reportTeacher}
                    colorScheme="purple"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CardContent>
  );
};

export default DutyRosterTable;
