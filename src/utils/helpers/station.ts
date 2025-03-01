import { DutyStation } from "@src/types";

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
