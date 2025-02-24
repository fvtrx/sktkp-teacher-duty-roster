import type { NextApiRequest, NextApiResponse } from "next";

export interface TeachersResponse {
  teachers: string[];
  total: number;
  timestamp: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TeachersResponse>
) {
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

  // Return the teachers array as JSON with 200 status code
  res.status(200).json({
    teachers: teachers,
    total: teachers.length,
    timestamp: new Date().toISOString(),
  });
}
