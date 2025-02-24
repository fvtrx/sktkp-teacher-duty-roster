import { DutyStations } from "@src/types";

export const months = [
  "Jan",
  "Feb",
  "Mac",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ogo",
  "Sep",
  "Okt",
  "Nov",
  "Dis",
] as const;

export const dayNames = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
] as const;

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
  pulang: [
    {
      id: "pagarDepanPulang",
      label: "Pagar Depan",
      selected: ["", ""],
      type: "dual",
    },
    {
      id: "pagarBelakangPulang",
      label: "Pagar Belakang",
      selected: ["", ""],
      type: "dual",
    },
    {
      id: "siarayaPulang",
      label: "Siaraya Pulang",
      selected: ["", ""],
      type: "dual",
    },
  ],
};
