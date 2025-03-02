import Image from "next/image";
import { Card, CardHeader, CardTitle } from "../ui/card";

const Header = () => {
  return (
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
  );
};

export default Header;
