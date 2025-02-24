import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-2 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex justify-center items-center text-sm text-gray-600">
        <span className="flex gap-2">
          Built with
          <Image width={40} height={40} src="/next.svg" alt="Next.js" /> by:
        </span>
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
  );
};

export default Footer;
