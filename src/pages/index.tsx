import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Check, Copy, Shuffle, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Input } from "@src/components/ui/input";
import Image from "next/image";
import Head from "next/head";
import DownloadTableImage from "@src/components/DownloadTableImage";
import Footer from "@src/components/common/Footer";
import { useGetSenaraiGuru } from "@src/utils/hooks/get/useGetSenaraiGuru";

const dayNames = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
] as const;

type DayName = (typeof dayNames)[number];

const months = [
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

interface SingleTeacherStation {
  id: string;
  label: string;
  selected: string;
  type: "single";
}

interface DualTeacherStation {
  id: string;
  label: string;
  selected: string[];
  type: "dual";
}

type DutyStation = SingleTeacherStation | DualTeacherStation;

export interface DutyStations {
  pagi: DualTeacherStation[];
  rehat: DualTeacherStation[];
  pulang: (SingleTeacherStation | DualTeacherStation)[];
}

interface FormErrors {
  kumpulan: boolean;
  minggu: boolean;
  reportTeacher: boolean;
  stations: {
    [key: string]: boolean | boolean[];
  };
  showErrors: boolean;
}

const DutyRosterApp: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const currentDay = dayNames[today.getDay()];

  const { data, isLoading, isError } = useGetSenaraiGuru();
  const teachers = data?.teachers;

  const initialDutyStations: DutyStations = {
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
        label: "Siaraya Tahap 1 & 2",
        selected: "",
        type: "single",
      },
    ],
  };

  const [rosterData, setRosterData] =
    useState<DutyStations>(initialDutyStations);
  const [reportTeacher, setReportTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayName>(currentDay);
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [copied, setCopied] = useState(false);
  const [kumpulan, setKumpulan] = useState("");
  const [minggu, setMinggu] = useState("");

  // Add new state for validation errors
  const [formErrors, setFormErrors] = useState<FormErrors>({
    kumpulan: false,
    minggu: false,
    reportTeacher: false,
    stations: {},
    showErrors: false,
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      kumpulan: kumpulan.trim() === "",
      minggu: minggu.trim() === "",
      reportTeacher: reportTeacher === "",
      stations: {},
      showErrors: true,
    };

    // Validate all duty stations
    Object.entries(rosterData).forEach((stations: DutyStation[]) => {
      stations.forEach(({ type, selected, id }) => {
        if (type === "dual") {
          // Check if both teachers are selected for dual stations
          errors.stations[id] = [selected[0] === "", selected[1] === ""];
        } else {
          // Check if a teacher is selected for single stations
          errors.stations[id] = selected === "";
        }
      });
    });

    setFormErrors(errors);

    // Check if there are any errors
    return (
      !errors.kumpulan &&
      !errors.minggu &&
      !errors.reportTeacher &&
      !Object.values(errors.stations).some((error) => {
        if (Array.isArray(error)) {
          return error.some((e) => e);
        }
        return error;
      })
    );
  };

  const handleTeacherSelect = (
    section: keyof DutyStations,
    stationId: string,
    teacherName: string,
    index?: number
  ) => {
    setRosterData((prev) => {
      const newData = { ...prev };
      const station = newData[section].find((s) => s.id === stationId);

      if (!station) return prev;

      if (station.type === "dual" && typeof index === "number") {
        station.selected[index] = teacherName;
      } else if (station.type === "single") {
        station.selected = teacherName;
      }

      return newData;
    });

    // Clear error for this station when a teacher is selected
    if (formErrors.showErrors) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        if (
          typeof index === "number" &&
          Array.isArray(newErrors.stations[stationId])
        ) {
          (newErrors.stations[stationId] as boolean[])[index] = false;
        } else {
          newErrors.stations[stationId] = false;
        }
        return newErrors;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const generateMessage = (): string => {
    const dateStr =
      selectedDate && selectedDay
        ? `${selectedDay} - ${formatDate(selectedDate)}`
        : "[Tarikh belum dipilih]";

    const formatDuty = (station: DutyStation) => {
      if (station.type === "dual") {
        return (
          station.selected.filter(Boolean).join(" / ") || "[Belum dipilih]"
        );
      }
      return station.selected || "[Belum dipilih]";
    };

    // Using array join with newlines for consistent formatting
    const lines = [
      `📢 KUMPULAN ${kumpulan} GURU BERTUGAS MINGGUAN SESI 2025`,
      `Assalamualaikum w.b.t. dan selamat sejahtera.`,
      ``,
      `📒 JADUAL BERTUGAS MINGGU ${minggu}`,
      `📆 ${dateStr}`,
      ``,
      `📌 PAGI`,
      ...rosterData.pagi.map(
        (station) => `🔹 ${station.label} - ${formatDuty(station)}`
      ),
      ``,
      `📌 REHAT`,
      ...rosterData.rehat.map(
        (station) => `🔹 ${station.label} - ${formatDuty(station)}`
      ),
      ``,
      `📌 PULANG`,
      ...rosterData.pulang.map(
        (station) => `🔹 ${station.label} - ${formatDuty(station)}`
      ),
      ``,
      `📌 BUKU LAPORAN`,
      `📖 ${reportTeacher || "[Belum dipilih]"}`,
      ``,
      `Selamat menjalankan tugas!`,
    ];

    return lines.join("\n");
  };

  const handleCopy = async () => {
    // First validate the form
    if (!validateForm()) {
      // If validation fails, scroll to top to show error messages
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const message = generateMessage();
    try {
      // Modern approach
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDate = new Date(e.target.value);
    setSelectedDate(e.target.value);
    setSelectedDay(dayNames[newDate.getDay()]);
  };

  const handleReset = () => {
    // Reset all state to initial values
    setRosterData(initialDutyStations);
    setReportTeacher("");
    setSelectedDay(currentDay);
    setSelectedDate(formattedDate);
    setKumpulan("");
    setMinggu("");
    setFormErrors({
      kumpulan: false,
      minggu: false,
      reportTeacher: false,
      stations: {},
      showErrors: false,
    });
  };

  const handleDownload = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    return true;
  };

  const isFormEmpty =
    JSON.stringify(rosterData) === JSON.stringify(initialDutyStations) &&
    reportTeacher === "" &&
    kumpulan === "" &&
    minggu === "";

  const randomizeTeachers = (): void => {
    const shuffledTeachers = [...(teachers ?? [])].sort(
      () => Math.random() - 0.5
    );
    let teacherIndex = 0;

    const newRoster = JSON.parse(JSON.stringify(initialDutyStations));

    // Fill in pagi stations (dual teacher each)
    newRoster.pagi.forEach((station: DualTeacherStation) => {
      for (let i = 0; i < 2; i++) {
        if (teacherIndex < shuffledTeachers.length) {
          station.selected[i] = shuffledTeachers[teacherIndex++];
        }
      }
    });

    // Fill in rehat stations (two teachers each)
    newRoster.rehat.forEach((station: DualTeacherStation) => {
      for (let i = 0; i < 2; i++) {
        if (teacherIndex < shuffledTeachers.length) {
          station.selected[i] = shuffledTeachers[teacherIndex++];
        }
      }
    });

    // Fill in pulang stations (mixed single and dual)
    newRoster.pulang.forEach((station: DutyStation) => {
      if (station.type === "single") {
        if (teacherIndex < shuffledTeachers.length) {
          station.selected = shuffledTeachers[teacherIndex++];
        }
      } else {
        for (let i = 0; i < 2; i++) {
          if (teacherIndex < shuffledTeachers.length) {
            station.selected[i] = shuffledTeachers[teacherIndex++];
          }
        }
      }
    });

    // Assign report teacher
    let reportTeacherIndex = teacherIndex;
    if (reportTeacherIndex >= shuffledTeachers.length) {
      // If we've run out of teachers, wrap around to the beginning
      reportTeacherIndex = 0;
    }

    // Update the state
    setRosterData(newRoster);
    setReportTeacher(shuffledTeachers[reportTeacherIndex]);

    // If there were errors showing, clear them since we've filled all the fields
    if (formErrors.showErrors) {
      setFormErrors({
        kumpulan: kumpulan.trim() === "",
        minggu: minggu.trim() === "",
        reportTeacher: false,
        stations: {},
        showErrors: true,
      });
    }
  };

  const renderTeacherSelect = (
    station: DutyStation,
    section: keyof DutyStations
  ) => {
    if (station.type === "dual") {
      return (
        <div className="flex flex-col lg:flex-row gap-2">
          {[0, 1].map((index) => (
            <div key={index} className="flex-1">
              <Select
                value={station.selected[index]}
                onValueChange={(value) =>
                  handleTeacherSelect(section, station.id, value, index)
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`w-full ${
                    formErrors.showErrors &&
                    Array.isArray(formErrors.stations[station.id]) &&
                    (formErrors.stations[station.id] as boolean[])[index]
                      ? "border-red-500 ring-1 ring-red-500"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Memuatkan...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Pilih Guru" />
                  )}
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.showErrors &&
                Array.isArray(formErrors.stations[station.id]) &&
                (formErrors.stations[station.id] as boolean[])[index] && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Sila pilih guru
                  </p>
                )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full lg:w-1/2">
        <Select
          value={station.selected}
          onValueChange={(value) =>
            handleTeacherSelect(section, station.id, value)
          }
          disabled={isLoading}
        >
          <SelectTrigger
            className={
              formErrors.showErrors && formErrors.stations[station.id]
                ? "border-red-500 ring-1 ring-red-500"
                : ""
            }
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Memuatkan...</span>
              </div>
            ) : (
              <SelectValue placeholder="Pilih Guru" />
            )}
          </SelectTrigger>
          <SelectContent className="min-w-[200px]">
            {teachers?.map((teacher) => (
              <SelectItem key={teacher} value={teacher}>
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.showErrors && formErrors.stations[station.id] && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Sila pilih guru
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Sistem Pengurusan Jadual Bertugas Guru SKTKP</title>
        <meta
          content="Penjana jadual bertugas untuk guru-guru SK Taman Koperasi Polis"
          name="description"
        />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <div className="min-h-screen relative pb-4">
        <div className="fixed inset-0 z-0">
          <img
            src="/sktkp-bg.jpg"
            alt="background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-yellow-500/30 to-orange-500/30 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-6 md:py-8 max-w-4xl">
          {/* Show validation error alert */}
          {formErrors.showErrors && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 mr-2" />
                <p className="font-bold">
                  Sila lengkapkan semua maklumat yang diperlukan
                </p>
              </div>
              <p className="text-sm mt-1">
                Semua maklumat perlu diisi sebelum jadual lengkap guru bertugas
                dapat dijana.
              </p>
            </div>
          )}

          <Card className="mb-6">
            <div className="flex flex-col justify-center place-items-center p-4 md:p-6">
              <Image
                alt="SKTKP Logo"
                src="/sktkp-logo.jpg"
                width={100}
                height={100}
              />
              <CardHeader className="pb-2 md:pb-4 -mt-4">
                <CardTitle className="text-lg md:text-md lg:text-2xl text-center">
                  Sistem Pengurusan Jadual Bertugas <br /> Guru{" "}
                  <span className="bg-gradient-to-r from-blue-300 to-yellow-300 bg-clip-text  text-transparent">
                    SKTKP
                  </span>
                </CardTitle>
              </CardHeader>
            </div>

            <CardContent className="space-y-8 mt-4">
              {/* Kumpulan and Week Selection */}
              <section className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Maklumat Kumpulan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Kumpulan:
                      {formErrors.showErrors && formErrors.kumpulan && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      type="number"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                        formErrors.showErrors && formErrors.kumpulan
                          ? "border-red-500 ring-1 ring-red-500"
                          : ""
                      }`}
                      min="1"
                      value={kumpulan}
                      onChange={(e) => {
                        setKumpulan(e.target.value);
                        if (formErrors.showErrors) {
                          setFormErrors({
                            ...formErrors,
                            kumpulan: e.target.value.trim() === "",
                          });
                        }
                      }}
                      placeholder="Nombor Kumpulan"
                    />
                    {formErrors.showErrors && formErrors.kumpulan && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Sila masukkan nombor kumpulan
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Minggu:
                      {formErrors.showErrors && formErrors.minggu && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      type="number"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                        formErrors.showErrors && formErrors.minggu
                          ? "border-red-500 ring-1 ring-red-500"
                          : ""
                      }`}
                      min="1"
                      value={minggu}
                      onChange={(e) => {
                        setMinggu(e.target.value);
                        if (formErrors.showErrors) {
                          setFormErrors({
                            ...formErrors,
                            minggu: e.target.value.trim() === "",
                          });
                        }
                      }}
                      placeholder="Minggu"
                    />
                    {formErrors.showErrors && formErrors.minggu && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Sila masukkan nombor minggu
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Date Selection */}
              <section className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Pilih Hari dan Tarikh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Hari:</label>

                    <Select
                      value={selectedDay}
                      onValueChange={(value: DayName) => {
                        if (dayNames.includes(value)) {
                          setSelectedDay(value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Guru" />
                      </SelectTrigger>
                      <SelectContent className="min-w-[200px]">
                        {dayNames.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Tarikh:</label>
                    <input
                      type="date"
                      className="w-full p-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
              </section>

              {/* Duty Stations */}
              {isError && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md mb-6">
                  <p className="font-medium">
                    Ralat semasa memuatkan senarai guru
                  </p>
                  <p className="text-sm">
                    Sila muat semula halaman atau cuba lagi sebentar.
                  </p>
                </div>
              )}

              {!isError && (
                <>
                  {(
                    Object.entries(rosterData) as Array<
                      [keyof DutyStations, DutyStation[]]
                    >
                  ).map(([section, stations]) => (
                    <section key={section} className="space-y-4">
                      <h3 className="text-lg md:text-xl font-semibold capitalize">
                        {section}
                      </h3>
                      <div className="space-y-6">
                        {stations.map((station) => (
                          <div key={station.id} className="space-y-2">
                            <label className="block text-sm font-medium">
                              {station.label}:
                              {formErrors.showErrors &&
                                formErrors.stations[station.id] && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>
                            {renderTeacherSelect(station, section)}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}

                  {/* Report Book Assignment */}
                  <section className="space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold">
                      Buku Laporan
                    </h3>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Guru Bertugas:
                        {formErrors.showErrors && formErrors.reportTeacher && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="w-full lg:w-1/2">
                        <Select
                          value={reportTeacher}
                          onValueChange={(value) => {
                            setReportTeacher(value);
                            if (formErrors.showErrors) {
                              setFormErrors({
                                ...formErrors,
                                reportTeacher: value === "",
                              });
                            }
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger
                            className={
                              formErrors.showErrors && formErrors.reportTeacher
                                ? "border-red-500 ring-1 ring-red-500"
                                : ""
                            }
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span>Memuatkan...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Pilih Guru" />
                            )}
                          </SelectTrigger>
                          <SelectContent className="min-w-[200px]">
                            {teachers?.map((teacher) => (
                              <SelectItem key={teacher} value={teacher}>
                                {teacher}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.showErrors && formErrors.reportTeacher && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Sila pilih guru
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              )}

              <div className="pt-8 place-items-center lg:place-items-end">
                <Button
                  variant="outline"
                  className="rounded-md text-sm md:text-base px-6 flex items-center gap-2"
                  size="lg"
                  onClick={randomizeTeachers}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Memuatkan...</span>
                    </>
                  ) : (
                    <>
                      <Shuffle />
                      Pilih guru secara rawak
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Message Card */}

          <Card className="w-full">
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex flex-col items-start justify-between gap-4">
                <CardTitle className="text-lg md:text-xl">
                  {`Jadual Bertugas Minggu ${minggu || ""} - Kumpulan ${
                    kumpulan || ""
                  }`}
                </CardTitle>

                <div className="flex flex-col w-full md:flex-row lg:flex-row gap-2 pt-2">
                  <Button
                    variant="destructive"
                    className="rounded-md text-sm md:text-base px-6"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-md text-sm md:text-base px-6 flex items-center gap-2"
                    size="sm"
                    onClick={handleCopy}
                    disabled={isFormEmpty}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Salin Mesej</span>
                      </>
                    )}
                  </Button>
                  {/* Modified DownloadTableImage component that checks validation first */}
                  <DownloadTableImage
                    isFormEmpty={isFormEmpty}
                    onBeforeDownload={handleDownload}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="table-container">
                  <table className="min-w-full bg-white table-fixed">
                    <colgroup>
                      <col style={{ width: "15%" }} /> {/* Waktu column */}
                      <col style={{ width: "35%" }} /> {/* Lokasi column */}
                      <col style={{ width: "50%" }} />{" "}
                      {/* Guru Bertugas column */}
                    </colgroup>
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Waktu</th>
                        <th className="border px-4 py-2 text-left">Lokasi</th>
                        <th className="border px-4 py-2 text-left">
                          Guru Bertugas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Pagi Section */}
                      {rosterData.pagi.map((station, index) => (
                        <tr
                          key={station.id}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          {index === 0 && (
                            <td
                              className="border px-4 py-2 font-semibold waktu-cell"
                              rowSpan={rosterData.pagi.length}
                            >
                              📌 PAGI
                            </td>
                          )}
                          <td className="border px-4 py-2">{station.label}</td>
                          <td className="border px-4 py-2 truncate">
                            {Array.isArray(station.selected)
                              ? station.selected.filter(Boolean).length > 0
                                ? station.selected.filter(Boolean).join(" / ")
                                : "[Belum dipilih]"
                              : station.selected || "[Belum dipilih]"}
                          </td>
                        </tr>
                      ))}

                      {/* Rehat Section */}
                      {rosterData.rehat.map((station, index) => (
                        <tr
                          key={station.id}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          {index === 0 && (
                            <td
                              className="border px-4 py-2 font-semibold waktu-cell"
                              rowSpan={rosterData.rehat.length}
                            >
                              📌 REHAT
                            </td>
                          )}
                          <td className="border px-4 py-2">{station.label}</td>
                          <td className="border px-4 py-2 truncate">
                            {Array.isArray(station.selected)
                              ? station.selected.filter(Boolean).length > 0
                                ? station.selected.filter(Boolean).join(" / ")
                                : "[Belum dipilih]"
                              : station.selected || "[Belum dipilih]"}
                          </td>
                        </tr>
                      ))}

                      {/* Pulang Section */}
                      {rosterData.pulang.map((station, index) => (
                        <tr
                          key={station.id}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          {index === 0 && (
                            <td
                              className="border px-4 py-2 font-semibold waktu-cell"
                              rowSpan={rosterData.pulang.length}
                            >
                              📌 PULANG
                            </td>
                          )}
                          <td className="border px-4 py-2">{station.label}</td>
                          <td className="border px-4 py-2 truncate">
                            {Array.isArray(station.selected)
                              ? station.selected.filter(Boolean).length > 0
                                ? station.selected.filter(Boolean).join(" / ")
                                : "[Belum dipilih]"
                              : station.selected || "[Belum dipilih]"}
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-gray-50">
                        <td className="border px-4 py-2 font-semibold waktu-cell">
                          📌 BUKU LAPORAN
                        </td>
                        <td className="border px-4 py-2">Guru Bertugas</td>
                        <td className="border px-4 py-2 truncate">
                          {reportTeacher || "[Belum dipilih]"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support me by keeping this in the footer, please. :) */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default DutyRosterApp;
