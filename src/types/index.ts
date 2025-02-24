import { dayNames } from "@src/lib/constant";

export type DayName = (typeof dayNames)[number];

export interface SingleTeacherStation {
  id: string;
  label: string;
  selected: string;
  type: "single";
}

export interface DualTeacherStation {
  id: string;
  label: string;
  selected: string[];
  type: "dual";
}

export type DutyStation = SingleTeacherStation | DualTeacherStation;

export interface DutyStations {
  pagi: DualTeacherStation[];
  rehat: DualTeacherStation[];
  pulang: (SingleTeacherStation | DualTeacherStation)[];
}

export interface FormErrors {
  kumpulan: boolean;
  minggu: boolean;
  reportTeacher: boolean;
  stations: {
    [key: string]: boolean | boolean[];
  };
  showErrors: boolean;
}
