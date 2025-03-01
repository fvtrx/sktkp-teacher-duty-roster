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

export interface PulangStations {
  tahap1: DutyStation[];
  tahap2: DutyStation[];
}

export interface DutyStations {
  pagi: DutyStation[];
  rehat: DutyStation[];
  pulang: PulangStations;
}

export const initialDutyStations: DutyStations = {
  pagi: [
    {
      id: "pagarDepanPagi",
      label: "Pagar Depan",
      selected: ["", ""],
      type: "dual",
    },
    {
      id: "pagarBelakangPagi",
      label: "Pagar Belakang",
      selected: ["", ""],
      type: "dual",
    },
    {
      id: "siarayaPagi",
      label: "Siaraya Pagi",
      selected: ["", ""],
      type: "dual",
    },
  ],
  rehat: [
    {
      id: "kantin13",
      label: "Siaraya / Kantin Tahun 1 & 3",
      selected: ["", ""],
      type: "dual",
    },
    {
      id: "kantin24",
      label: "Siaraya / Kantin Tahun 2 & 4",
      selected: ["", ""],
      type: "dual",
    },
    {
      id: "kantin56",
      label: "Siaraya / Kantin Tahun 5 & 6",
      selected: ["", ""],
      type: "dual",
    },
  ],
  pulang: {
    tahap1: [
      {
        id: "pagarDepanPulangTahap1",
        label: "Pagar Depan",
        selected: ["", ""],
        type: "dual",
      },
      {
        id: "pagarBelakangPulangTahap1",
        label: "Pagar Belakang",
        selected: ["", ""],
        type: "dual",
      },
      {
        id: "siarayaPulangTahap1",
        label: "Siaraya Pulang",
        selected: "",
        type: "single",
      },
    ],
    tahap2: [
      {
        id: "pagarDepanPulangTahap2",
        label: "Pagar Depan",
        selected: ["", ""],
        type: "dual",
      },
      {
        id: "pagarBelakangPulangTahap2",
        label: "Pagar Belakang",
        selected: ["", ""],
        type: "dual",
      },
      {
        id: "siarayaPulangTahap2",
        label: "Siaraya Pulang",
        selected: "",
        type: "single",
      },
    ],
  },
};

export interface FormErrors {
  kumpulan: boolean;
  minggu: boolean;
  reportTeacher: boolean;
  stations: {
    [key: string]: boolean | boolean[];
  };
  showErrors: boolean;
}
