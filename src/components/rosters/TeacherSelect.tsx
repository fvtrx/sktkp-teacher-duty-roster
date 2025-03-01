import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TeacherSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  isLoading: boolean;
  teachers: string[] | undefined;
  hasError: boolean;
  focusColors?: string;
  errorMessage?: string;
  placeholder?: string;
}

const TeacherSelect: React.FC<TeacherSelectProps> = ({
  value,
  onValueChange,
  isLoading,
  teachers,
  hasError,
  focusColors = "focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
  errorMessage = "Sila pilih guru",
  placeholder = "Pilih Guru",
}) => (
  <>
    <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
      <SelectTrigger
        className={`transition-all border-gray-200 hover:border-gray-300 rounded-lg ${
          hasError ? "border-red-500 ring-1 ring-red-500" : focusColors
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
            <span>Memuatkan...</span>
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
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
    {hasError && (
      <p className="text-red-500 text-xs mt-1 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        {errorMessage}
      </p>
    )}
  </>
);

export default TeacherSelect;
