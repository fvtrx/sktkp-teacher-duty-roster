import { DutyStation, DutyStations, FormErrors } from "@src/types";

interface RosterSectionProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  stations: DutyStation[];
  period: keyof DutyStations | "pulang.tahap1" | "pulang.tahap2";
  formErrors: FormErrors;
  isLoading: boolean;
  teachers: string[] | undefined;
  renderTeacherSelect?: (
    station: DutyStation,
    period: keyof DutyStations | "pulang.tahap1" | "pulang.tahap2"
  ) => React.ReactNode;
  renderStationSelect?: (station: DutyStation) => React.ReactNode;
}

const RosterSection: React.FC<RosterSectionProps> = ({
  title,
  icon,
  iconBgColor,
  iconTextColor,
  stations,
  period,
  formErrors,

  renderTeacherSelect,
  renderStationSelect,
}) => (
  <section className="space-y-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center">
      <span
        className={`w-6 h-6 rounded-full ${iconBgColor} ${iconTextColor} inline-flex items-center justify-center mr-2`}
      >
        {icon}
      </span>
      <span className="capitalize">{title}</span>
    </h3>
    <div className="space-y-4">
      {stations.map((station) => (
        <div
          key={station.id}
          className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all shadow-sm"
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {station.label}:
            {formErrors.showErrors && formErrors.stations[station.id] && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          {renderStationSelect
            ? renderStationSelect(station)
            : renderTeacherSelect?.(station, period)}
        </div>
      ))}
    </div>
  </section>
);

export default RosterSection;
