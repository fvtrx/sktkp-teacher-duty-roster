import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Check, Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Input } from "@src/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import DownloadTableImage from "@src/components/DownloadTableImage";

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
  selected: [string, string];
  type: "dual";
}

type DutyStation = SingleTeacherStation | DualTeacherStation;

export interface DutyStations {
  pagi: SingleTeacherStation[];
  rehat: DualTeacherStation[];
  pulang: SingleTeacherStation[];
}

const DutyRosterApp: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const currentDay = dayNames[today.getDay()];

  const teachers = [
    "ABDULLAH FADZIL",
    "NUR SYARIJIAH",
    "SITI ZALIHA",
    "AMIR JAUHARI",
    "NURSAKINAH",
    "SALIMATUL SA'ADAH",
    "BALQIS",
    "MOHAMMAD HASRUL HAFIZ",
    "NOOR AQEELA",
    "SAIFUL AZLAN",
    "SUHAWADI",
    "NAN MUSTAQIM",
    "MUHAMMAD SYAHID SHARHAN",
    "NUR HIDAYAH IZZATI",
    "NUR ATIQAH",
    "SITI NURUL NADWA",
    "ROZIMAH",
    "NOR AZMIRA",
    "SHAH LIZA AZRIN",
    "MOHD HAFIZ",
    "AINA",
    "ANUCIA",
  ];

  const initialDutyStations: DutyStations = {
    pagi: [
      {
        id: "pagarDepanPagi",
        label: "Pagar Depan",
        selected: "",
        type: "single",
      },
      {
        id: "pagarBelakangPagi",
        label: "Pagar Belakang",
        selected: "",
        type: "single",
      },
      {
        id: "siarayaPagi",
        label: "Siaraya Pagi",
        selected: "",
        type: "single",
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
      { id: "siarayaPulang", label: "Siaraya", selected: "", type: "single" },
      {
        id: "pagarDepanPulang",
        label: "Pagar Depan",
        selected: "",
        type: "single",
      },
      {
        id: "pagarBelakangPulang",
        label: "Pagar Belakang",
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
  const [kumpulan, setKumpulan] = useState("1");
  const [minggu, setMinggu] = useState("");

  const handleTeacherSelect = (
    section: keyof DutyStations,
    stationId: string,
    teacherName: string,
    index?: number
  ): void => {
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
  };

  const formatDate = (dateString: string): string => {
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

    const formatRehatDuty = (station: DualTeacherStation) => {
      const teachers = station.selected.filter((t) => t).join(" / ");
      return teachers || "[Belum dipilih]";
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
        (station) =>
          `🔹 ${station.label} - ${station.selected || "[Belum dipilih]"}`
      ),
      ``,
      `📌 REHAT`,
      ...rosterData.rehat.map(
        (station) => `🔹 ${station.label} - ${formatRehatDuty(station)}`
      ),
      ``,
      `📌 PULANG`,
      ...rosterData.pulang.map(
        (station) =>
          `🔹 ${station.label} - ${station.selected || "[Belum dipilih]"}`
      ),
      ``,
      `📌 BUKU LAPORAN`,
      `📖 ${reportTeacher || "[Belum dipilih]"}`,
      ``,
      `Selamat menjalankan tugas!`,
    ];

    return lines.join("\n");
  };

  const renderTeacherCell = (station: DutyStation) => {
    if (station.type === "dual") {
      return (
        <td className="border px-4 py-2">
          {station.selected.join(" / ") || "[Belum dipilih]"}
        </td>
      );
    }
    return (
      <td className="border px-4 py-2">
        {station.selected || "[Belum dipilih]"}
      </td>
    );
  };

  const handleCopy = async () => {
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
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Guru" />
          </SelectTrigger>
          <SelectContent className="min-w-[200px]">
            {teachers.map((teacher) => (
              <SelectItem key={teacher} value={teacher}>
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const handleReset = () => {
    // Reset all state to initial values
    setRosterData(initialDutyStations);
    setReportTeacher("");
    setSelectedDay(currentDay);
    setSelectedDate(formattedDate);
    setKumpulan("1");
    setMinggu("1");
  };

  return (
    <>
      <Head>
        <title>Sistem Pengurusan Jadual Bertugas Guru SKTKP</title>
        <meta
          content="Penjana jadual bertugas untuk guru-guru SK Taman Koperasi Polis"
          name="description"
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
                    </label>
                    <Input
                      type="number"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      min="1"
                      value={kumpulan}
                      onChange={(e) => setKumpulan(e.target.value)}
                      placeholder="Nombor Kumpulan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Minggu:</label>
                    <Input
                      type="number"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      min="1"
                      value={minggu}
                      onChange={(e) => setMinggu(e.target.value)}
                      placeholder="Minggu"
                    />
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
                  </label>
                  <div className="w-full lg:w-1/2">
                    <Select
                      value={reportTeacher}
                      onValueChange={(value) => setReportTeacher(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Guru" />
                      </SelectTrigger>
                      <SelectContent className="min-w-[200px]">
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher} value={teacher}>
                            {teacher}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Generated Message Card */}

          <Card className="w-full">
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg md:text-xl">
                  {`Jadual Bertugas Minggu ${minggu} - Kumpulan ${kumpulan}`}
                </CardTitle>

                <div className="flex flex-col md:flex-row lg:flex-row  gap-2 pt-2">
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
                  <DownloadTableImage />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto ">
                <div className="table-container">
                  <table className="min-w-full bg-white">
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
                              className="border px-4 py-2 font-semibold"
                              rowSpan={rosterData.pagi.length}
                            >
                              📌 PAGI
                            </td>
                          )}
                          <td className="border px-4 py-2">{station.label}</td>
                          {renderTeacherCell(station)}
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
                              className="border px-4 py-2 font-semibold"
                              rowSpan={rosterData.rehat.length}
                            >
                              📌 REHAT
                            </td>
                          )}
                          <td className="border px-4 py-2">{station.label}</td>
                          {renderTeacherCell(station)}
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
                              className="border px-4 py-2 font-semibold"
                              rowSpan={rosterData.pulang.length}
                            >
                              📌 PULANG
                            </td>
                          )}
                          <td className="border px-4 py-2">{station.label}</td>
                          {renderTeacherCell(station)}
                        </tr>
                      ))}

                      <tr className="bg-gray-50">
                        <td className="border px-4 py-2 font-semibold">
                          📌 BUKU LAPORAN
                        </td>
                        <td className="border px-4 py-2">Guru Bertugas</td>
                        <td className="border px-4 py-2">
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
          <footer className="fixed bottom-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex justify-center items-center gap-2 text-sm text-gray-600">
              <span>Dibina oleh</span>
              <div className="inline-block transform hover:scale-110 hover:-rotate-3 transition duration-300">
                <Link
                  href="https://fvtrx.com"
                  className="hover:bg-black rounded-md px-2 py-1 font-bold  hover:text-white cursor-pointer"
                >
                  Abdullah Fitri &copy; FVTRX.
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default DutyRosterApp;
