import { dayNames } from "@src/lib/constant";
import type { DutyStations, DayName, FormErrors } from "@src/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Group related states into logical objects
interface TeacherRosterContextState {
  // Roster data
  roster: {
    data: DutyStations;
    reportTeacher: string;
  };

  // Date related info
  schedule: {
    day: DayName;
    date: string;
    currentYear: number;
    kumpulan: string;
    minggu: string;
  };

  // UI state
  ui: {
    copied: boolean;
    formErrors: FormErrors;
  };

  // State setters
  set: {
    rosterData: React.Dispatch<React.SetStateAction<DutyStations>>;
    reportTeacher: React.Dispatch<React.SetStateAction<string>>;
    selectedDay: React.Dispatch<React.SetStateAction<DayName>>;
    selectedDate: React.Dispatch<React.SetStateAction<string>>;
    copied: React.Dispatch<React.SetStateAction<boolean>>;
    kumpulan: React.Dispatch<React.SetStateAction<string>>;
    minggu: React.Dispatch<React.SetStateAction<string>>;
    formErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  };
}

// Create context with default undefined value
const TeacherRosterContext = createContext<
  TeacherRosterContextState | undefined
>(undefined);

interface TeacherRosterProviderProps {
  children: ReactNode;
  initialDutyStations: DutyStations;
}

export const TeacherRosterProvider: React.FC<TeacherRosterProviderProps> = ({
  children,
  initialDutyStations,
}) => {
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const currentDayName = dayNames[today.getDay()];
  const currentYear = today.getFullYear();
  // Initialize state
  const [rosterData, setRosterData] =
    useState<DutyStations>(initialDutyStations);
  const [reportTeacher, setReportTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayName>(currentDayName);
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const [copied, setCopied] = useState(false);
  const [kumpulan, setKumpulan] = useState("");
  const [minggu, setMinggu] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({
    kumpulan: false,
    minggu: false,
    reportTeacher: false,
    stations: {},
    showErrors: false,
  });

  // Group state into logical objects
  const value: TeacherRosterContextState = {
    roster: {
      data: rosterData,
      reportTeacher,
    },
    schedule: {
      day: selectedDay,
      date: selectedDate,
      currentYear,
      kumpulan,
      minggu,
    },
    ui: {
      copied,
      formErrors,
    },
    set: {
      rosterData: setRosterData,
      reportTeacher: setReportTeacher,
      selectedDay: setSelectedDay,
      selectedDate: setSelectedDate,
      copied: setCopied,
      kumpulan: setKumpulan,
      minggu: setMinggu,
      formErrors: setFormErrors,
    },
  };

  return (
    <TeacherRosterContext.Provider value={value}>
      {children}
    </TeacherRosterContext.Provider>
  );
};

// Usage hook
export const useTeacherRosterContext = (): TeacherRosterContextState => {
  const context = useContext(TeacherRosterContext);
  if (context === undefined) {
    throw new Error("useRoster must be used within a TeacherRosterProvider");
  }
  return context;
};
