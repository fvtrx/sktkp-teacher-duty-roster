import Link from "next/link";

const Footer = () => {
  return (
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
  );
};

export default Footer;
