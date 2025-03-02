import { AlertCircle } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  description: string;
};

const Alert: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="bg-white border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-red-800">{title}</p>
          <p className="text-sm mt-1 text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
