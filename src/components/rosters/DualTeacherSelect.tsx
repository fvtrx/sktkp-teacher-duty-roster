import { DualTeacherStation, FormErrors } from "@src/types";
import TeacherSelect from "./TeacherSelect";

interface DualTeacherSelectProps {
  station: DualTeacherStation;
  updateStation: (stationId: string, index: number, value: string) => void;
  formErrors: FormErrors;
  isLoading: boolean;
  teachers: string[] | undefined;
  checkAndUpdateFormErrors: () => void;
}

const DualTeacherSelect: React.FC<DualTeacherSelectProps> = ({
  station,
  updateStation,
  formErrors,
  isLoading,
  teachers,
  checkAndUpdateFormErrors,
}) => (
  <div className="flex flex-col lg:flex-row gap-3">
    {[0, 1].map((index) => (
      <div key={index} className="flex-1">
        <TeacherSelect
          value={station.selected[index]}
          onValueChange={(value: string) => {
            updateStation(station.id, index, value);
            if (formErrors.showErrors) {
              setTimeout(checkAndUpdateFormErrors, 100);
            }
          }}
          isLoading={isLoading}
          teachers={teachers}
          hasError={
            formErrors.showErrors &&
            formErrors.stations[station.id] &&
            Array.isArray(formErrors.stations[station.id]) &&
            (formErrors.stations[station.id] as [boolean, boolean])[index]
          }
        />
      </div>
    ))}
  </div>
);

export default DualTeacherSelect;
