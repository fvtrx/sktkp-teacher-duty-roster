import { DutyStation, DutyStations } from "@src/types";

export const isStationEmpty = (station: DutyStation): boolean | boolean[] => {
  if (station.type === "dual") {
    return [station.selected[0] === "", station.selected[1] === ""];
  }
  return station.selected === "";
};

export const hasEmptyStation = (stations: DutyStation[]): boolean => {
  return stations.some((station) => {
    if (station.type === "dual") {
      return station.selected[0] === "" || station.selected[1] === "";
    }
    return station.selected === "";
  });
};

export const findStation = (
  data: DutyStations,
  section: keyof DutyStations | "pulang.tahap1" | "pulang.tahap2",
  stationId: string
): DutyStation | undefined => {
  if (section === "pulang.tahap1") {
    return data.pulang.tahap1.find((s) => s.id === stationId);
  } else if (section === "pulang.tahap2") {
    return data.pulang.tahap2.find((s) => s.id === stationId);
  } else if (section === "pagi" || section === "rehat") {
    return data[section].find((s) => s.id === stationId);
  }
  return undefined;
};
