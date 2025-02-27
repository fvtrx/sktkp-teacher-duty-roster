import type {
  DayName,
  DutyStation,
  DutyStations,
  FormErrors,
} from "@src/types";

import DownloadTableImage from "@src/components/DownloadTableImage";
import Footer from "@src/components/common/Footer";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Input } from "@src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { dayNames, initialDutyStations, months } from "@src/lib/constant";
import { useTeacherRosterContext } from "@src/utils/context";
import { calculateCurrentWeek } from "@src/utils/helpers/datetime";
import { useGetSenaraiGuru } from "@src/utils/hooks/get/useGetSenaraiGuru";
import {
  AlertCircle,
  Calendar,
  Check,
  ClipboardList,
  Copy,
  Shuffle,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const DutyRosterApp: React.FC = () => {
  const {
    roster: { data: rosterData, reportTeacher },
    schedule: {
      kumpulan,
      date: selectedDate,
      day: selectedDay,
      minggu,
      currentYear,
    },
    ui: { formErrors, copied },
    set,
  } = useTeacherRosterContext();
  const [isRandomizedLoading, setIsRandomizedLoading] = useState(false);
  const currentWeek = calculateCurrentWeek();

  const { data, isLoading, isError } = useGetSenaraiGuru();
  const teachers = data?.teachers;

  useEffect(() => {
    if (minggu === "") {
      set.minggu(currentWeek.toString());
    }
  }, [minggu, set]);

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

    const lines = [
      `📢 KUMPULAN ${kumpulan} GURU BERTUGAS SKTKP MINGGUAN - SESI ${currentYear}`,
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
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const message = generateMessage();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      set.copied(true);
      setTimeout(() => set.copied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDate = new Date(e.target.value);
    set.selectedDate(e.target.value);
    set.selectedDay(dayNames[newDate.getDay()]);
  };

  const handleReset = () => {
    set.rosterData(initialDutyStations);
    set.reportTeacher("");
    set.selectedDay(selectedDay);
    set.selectedDate(selectedDate);
    set.kumpulan("");
    set.minggu(currentWeek.toString());
    set.formErrors({
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

  const randomizeTeachers = async (): Promise<void> => {
    setIsRandomizedLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const shuffledTeachers = [...(teachers ?? [])].sort(
        () => Math.random() - 0.5
      );

      const newRoster = JSON.parse(JSON.stringify(initialDutyStations));

      let teacherIndex = 0;

      const assignTeachersToStation = (
        station: DutyStation,
        count: number
      ): void => {
        if (station.type === "single") {
          if (teacherIndex < shuffledTeachers.length) {
            station.selected = shuffledTeachers[teacherIndex++];
          }
        } else {
          for (let i = 0; i < count; i++) {
            if (teacherIndex < shuffledTeachers.length) {
              station.selected[i] = shuffledTeachers[teacherIndex++];
            }
          }
        }
      };

      const processStations = (
        stations: DutyStation[],
        teachersPerStation: number
      ) => {
        stations.forEach((station) => {
          assignTeachersToStation(station, teachersPerStation);
        });
      };

      // Process each station category
      processStations(newRoster.pagi, 2);
      processStations(newRoster.rehat, 2);
      processStations(newRoster.pulang, 2);

      const reportTeacherIndex =
        teacherIndex < shuffledTeachers.length ? teacherIndex : 0;

      set.rosterData(newRoster);
      set.reportTeacher(shuffledTeachers[reportTeacherIndex]);

      if (formErrors.showErrors) {
        set.formErrors({
          kumpulan: kumpulan.trim() === "",
          minggu: minggu.trim() === "",
          reportTeacher: false,
          stations: {},
          showErrors: true,
        });
      }
    } catch (error) {
      console.error("Error during randomization:", error);
    } finally {
      setIsRandomizedLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      kumpulan: kumpulan.trim() === "",
      minggu: minggu.trim() === "",
      reportTeacher: reportTeacher === "",
      stations: {},
      showErrors: true,
    };

    Object.entries(rosterData).forEach((stations: DutyStation[]) => {
      stations.forEach(({ type, selected, id }) => {
        if (type === "dual") {
          errors.stations[id] = [selected[0] === "", selected[1] === ""];
        } else {
          errors.stations[id] = selected === "";
        }
      });
    });

    set.formErrors(errors);

    const hasErrors =
      errors.kumpulan ||
      errors.minggu ||
      errors.reportTeacher ||
      Object.values(errors.stations).some((error) => {
        if (Array.isArray(error)) {
          return error.some((e) => e);
        }
        return error;
      });

    return !hasErrors;
  };

  const checkAndUpdateFormErrors = () => {
    // Only check if we're showing errors (validation has failed previously)
    if (!formErrors.showErrors) return;

    // Check all required fields
    const hasEmptyFields =
      kumpulan.trim() === "" || minggu.trim() === "" || reportTeacher === "";

    // Check if any station is empty
    let hasEmptyStations = false;

    Object.keys(rosterData).forEach((sectionKey) => {
      const section = sectionKey as keyof DutyStations;
      for (const station of rosterData[section]) {
        if (station.type === "dual") {
          if (station.selected[0] === "" || station.selected[1] === "") {
            hasEmptyStations = true;
            break;
          }
        } else if (station.selected === "") {
          hasEmptyStations = true;
          break;
        }
      }
    });

    // If all fields are filled, hide the error banner
    if (!hasEmptyFields && !hasEmptyStations) {
      set.formErrors((prev) => ({ ...prev, showErrors: false }));
    }
  };

  const handleTeacherSelect = (
    section: keyof DutyStations,
    stationId: string,
    teacherName: string,
    index?: number
  ) => {
    set.rosterData((prev) => {
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

    if (formErrors.showErrors) {
      set.formErrors((prev) => {
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

      // Check if all fields are now valid after a short delay
      setTimeout(checkAndUpdateFormErrors, 100);
    }
  };

  const renderTeacherSelect = (
    station: DutyStation,
    section: keyof DutyStations
  ) => {
    if (station.type === "dual") {
      return (
        <div className="flex flex-col lg:flex-row gap-3">
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
                  className={`w-full transition-all border-gray-200 hover:border-gray-300 rounded-lg ${
                    formErrors.showErrors &&
                    formErrors.stations[station.id] &&
                    Array.isArray(formErrors.stations[station.id]) &&
                    (formErrors.stations[station.id] as boolean[])[index]
                      ? "border-red-500 ring-1 ring-red-500"
                      : "focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                      <span>Memuatkan...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Pilih Guru" />
                  )}
                </SelectTrigger>
                <SelectContent className="min-w-[200px] rounded-md shadow-md border-gray-200">
                  {teachers?.map((teacher) => (
                    <SelectItem
                      key={teacher}
                      value={teacher}
                      className="focus:bg-blue-50"
                    >
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.showErrors &&
                formErrors.stations[station.id] &&
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
            className={`transition-all border-gray-200 hover:border-gray-300 rounded-lg ${
              formErrors.showErrors &&
              formErrors.stations &&
              formErrors.stations[station.id]
                ? "border-red-500 ring-1 ring-red-500"
                : "focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                <span>Memuatkan...</span>
              </div>
            ) : (
              <SelectValue placeholder="Pilih Guru" />
            )}
          </SelectTrigger>
          <SelectContent className="min-w-[200px] rounded-md shadow-md border-gray-200">
            {teachers?.map((teacher) => (
              <SelectItem
                key={teacher}
                value={teacher}
                className="focus:bg-blue-50"
              >
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.showErrors &&
          formErrors.stations &&
          formErrors.stations[station.id] && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Sila pilih guru
            </p>
          )}
      </div>
    );
  };

  useEffect(() => {
    // Only run this check if we're showing errors (validation has happened)
    if (formErrors.showErrors) {
      // Check if all required fields have values
      const isKumpulanValid = kumpulan.trim() !== "";
      const isMingguValid = minggu.trim() !== "";
      const isReportTeacherValid = reportTeacher !== "";

      // Check if all stations have selections
      let areAllStationsValid = true;
      for (const section in rosterData) {
        // @ts-ignore
        for (const station of rosterData[section]) {
          if (station.type === "dual") {
            if (station.selected[0] === "" || station.selected[1] === "") {
              areAllStationsValid = false;
              break;
            }
          } else if (station.selected === "") {
            areAllStationsValid = false;
            break;
          }
        }
        if (!areAllStationsValid) break;
      }

      // If everything is valid, hide the error banner
      if (
        isKumpulanValid &&
        isMingguValid &&
        isReportTeacherValid &&
        areAllStationsValid
      ) {
        set.formErrors((prev) => ({ ...prev, showErrors: false }));
      }
    }
    // Include all form data dependencies to ensure the effect runs on any change
  }, [formErrors.showErrors, kumpulan, minggu, reportTeacher, rosterData, set]);

  return (
    <div>
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
      <div className="min-h-screen relative pb-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="fixed inset-0 z-0">
          <Image
            src="/sktkp-bg.jpg"
            alt="background"
            className="object-cover opacity-15"
            fill={true}
            sizes="100vw"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-white/50 to-purple-500/10 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-6 md:py-12 max-w-4xl">
          {/* Show validation error alert */}
          {formErrors.showErrors && (
            <div className="bg-white border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">
                    Sila lengkapkan semua maklumat yang diperlukan
                  </p>
                  <p className="text-sm mt-1 text-gray-600">
                    Semua maklumat perlu diisi sebelum jadual lengkap guru
                    bertugas dapat dijana.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Card */}
          <Card className="mb-8 overflow-hidden shadow-lg border-none bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 p-6 flex items-center justify-center">
              <div className="bg-white rounded-full p-3 shadow-md">
                <Image
                  alt="SKTKP Logo"
                  src="/sktkp-logo.jpg"
                  width={70}
                  height={70}
                  className="rounded-md"
                />
              </div>
            </div>
            <CardHeader className="pb-2 md:pb-4 text-center">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold">
                Sistem Pengurusan Jadual Bertugas
                <div className=" mt-1">
                  Guru{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 ">
                    SKTKP
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Main Form Card */}
          <Card className="mb-8 shadow-lg border-none bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              {/* Kumpulan and Week Selection */}
              <section className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-100">
                  Maklumat Kumpulan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kumpulan:
                      {formErrors.showErrors && formErrors.kumpulan && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      type="number"
                      className={`w-full p-3 border rounded-lg transition-all ${
                        formErrors.showErrors && formErrors.kumpulan
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                      min="1"
                      value={kumpulan}
                      onChange={(e) => {
                        set.kumpulan(e.target.value);
                        if (formErrors.showErrors) {
                          set.formErrors({
                            ...formErrors,
                            kumpulan: e.target.value.trim() === "",
                          });

                          // Check if all fields are now valid after a short delay
                          setTimeout(checkAndUpdateFormErrors, 100);
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
                    <label className="block text-sm font-medium text-gray-700">
                      Minggu:
                      {formErrors.showErrors && formErrors.minggu && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      type="number"
                      className={`w-full p-3 border rounded-lg transition-all ${
                        formErrors.showErrors && formErrors.minggu
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                      min="1"
                      value={minggu}
                      onChange={(e) => {
                        set.minggu(e.target.value);
                        if (formErrors.showErrors) {
                          set.formErrors({
                            ...formErrors,
                            minggu: e.target.value.trim() === "",
                          });

                          // Check if all fields are now valid after a short delay
                          setTimeout(checkAndUpdateFormErrors, 100);
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
              <section className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-100">
                  Pilih Hari dan Tarikh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hari:
                    </label>
                    <Select
                      value={selectedDay}
                      onValueChange={(value: DayName) => {
                        if (dayNames.includes(value)) {
                          set.selectedDay(value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full p-3 rounded-lg border-gray-200 hover:border-gray-300 transition-all">
                        <SelectValue placeholder="Pilih Hari" />
                      </SelectTrigger>
                      <SelectContent className="min-w-[200px] rounded-md">
                        {dayNames.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tarikh:
                    </label>
                    <input
                      type="date"
                      className="w-full p-1 border border-gray-200 hover:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
              </section>

              {/* Duty Stations */}
              {isError && (
                <div className="bg-white border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
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
                    <section key={section} className="space-y-6 mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                          <Calendar className="h-3.5 w-3.5" />
                        </span>
                        <span className="capitalize">{section}</span>
                      </h3>
                      <div className="space-y-4">
                        {stations.map((station) => (
                          <div
                            key={station.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all shadow-sm"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-3">
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
                  <section className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 inline-flex items-center justify-center mr-2">
                        <ClipboardList className="h-3.5 w-3.5" />
                      </span>
                      Buku Laporan
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-all shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Guru Bertugas:
                        {formErrors.showErrors && formErrors.reportTeacher && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="w-full lg:w-1/2">
                        <Select
                          value={reportTeacher}
                          onValueChange={(value) => {
                            set.reportTeacher(value);
                            if (formErrors.showErrors) {
                              set.formErrors({
                                ...formErrors,
                                reportTeacher: value === "",
                              });

                              // Check if all fields are now valid after a short delay
                              setTimeout(checkAndUpdateFormErrors, 100);
                            }
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger
                            className={`transition-all border-gray-200 hover:border-gray-300 rounded-lg ${
                              formErrors.showErrors && formErrors.reportTeacher
                                ? "border-red-500 ring-1 ring-red-500"
                                : "focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            }`}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                                <span>Memuatkan...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Pilih Guru" />
                            )}
                          </SelectTrigger>
                          <SelectContent className="min-w-[200px] rounded-md shadow-md">
                            {teachers?.map((teacher) => (
                              <SelectItem
                                key={teacher}
                                value={teacher}
                                className="focus:bg-purple-50"
                              >
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

              <div className="mt-10 flex justify-end">
                <Button
                  className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 h-auto text-sm md:text-base flex items-center gap-2 shadow-md transition-all"
                  onClick={randomizeTeachers}
                  disabled={isLoading || isRandomizedLoading}
                >
                  {isLoading || isRandomizedLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>
                        {isLoading
                          ? "Memuatkan..."
                          : isRandomizedLoading
                          ? "Dalam proses..."
                          : "Jana jadual rawak"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Shuffle className="h-5 w-5" />
                      <span>Jana jadual rawak</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Message Card */}
          <Card className="w-full shadow-lg border-none bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                  {`Jadual Bertugas ${minggu ? `Minggu ${minggu}` : ""} ${
                    kumpulan ? `- Kumpulan ${kumpulan}` : ""
                  }`}
                </CardTitle>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                    size="sm"
                    onClick={handleReset}
                  >
                    <span>Reset</span>
                  </Button>
                  <Button
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-2"
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
                  <DownloadTableImage
                    isFormEmpty={isFormEmpty}
                    onBeforeDownload={handleDownload}
                  />
                </div>
              </div>
            </CardHeader>

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
                      {/* Pagi Section */}
                      {rosterData.pagi.map((station, index) => (
                        <tr
                          key={station.id}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          {index === 0 && (
                            <td
                              className="px-6 py-4 font-medium text-blue-600 align-top"
                              rowSpan={rosterData.pagi.length}
                            >
                              📌 PAGI
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {station.label}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {Array.isArray(station.selected) ? (
                              station.selected.filter(Boolean).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {station.selected
                                    .filter(Boolean)
                                    .map((teacher, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                      >
                                        {teacher}
                                      </span>
                                    ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  Belum dipilih
                                </span>
                              )
                            ) : station.selected ? (
                              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {station.selected}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Belum dipilih
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Rehat Section */}
                      {rosterData.rehat.map((station, index) => (
                        <tr
                          key={station.id}
                          className="hover:bg-green-50 transition-colors"
                        >
                          {index === 0 && (
                            <td
                              className="px-6 py-4 font-medium text-green-600 align-top"
                              rowSpan={rosterData.rehat.length}
                            >
                              📌 REHAT
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {station.label}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {Array.isArray(station.selected) ? (
                              station.selected.filter(Boolean).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {station.selected
                                    .filter(Boolean)
                                    .map((teacher, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                      >
                                        {teacher}
                                      </span>
                                    ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  Belum dipilih
                                </span>
                              )
                            ) : station.selected ? (
                              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {station.selected}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Belum dipilih
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Pulang Section */}
                      {rosterData.pulang.map((station, index) => (
                        <tr
                          key={station.id}
                          className="hover:bg-indigo-50 transition-colors"
                        >
                          {index === 0 && (
                            <td
                              className="px-6 py-4 font-medium text-indigo-600 align-top"
                              rowSpan={rosterData.pulang.length}
                            >
                              📌 PULANG
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {station.label}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            {Array.isArray(station.selected) ? (
                              station.selected.filter(Boolean).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {station.selected
                                    .filter(Boolean)
                                    .map((teacher, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                      >
                                        {teacher}
                                      </span>
                                    ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  Belum dipilih
                                </span>
                              )
                            ) : station.selected ? (
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {station.selected}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">
                                Belum dipilih
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Buku Laporan */}
                      <tr className="hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-purple-600">
                          📌 BUKU LAPORAN
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          Guru Bertugas
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {reportTeacher ? (
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {reportTeacher}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              Belum dipilih
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DutyRosterApp;
