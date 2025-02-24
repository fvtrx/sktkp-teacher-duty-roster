import { useQuery, UseQueryOptions } from "react-query";
import { teacherService } from "../../services/teacherService";
import { TeachersResponse } from "@src/pages/api/senarai-guru";
import { handleAxiosError } from "../../services/api";

const fetchSenaraiGuru = async (): Promise<TeachersResponse> => {
  try {
    // Use the teacher service to fetch all teachers
    return await teacherService.getTeachers();
  } catch (error) {
    // Use the helper to handle Axios errors
    throw new Error(handleAxiosError(error));
  }
};

// Simplified custom hook for using the teachers API with react-query
export function useGetSenaraiGuru(
  options?: Omit<
    UseQueryOptions<TeachersResponse, Error, TeachersResponse, string>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<TeachersResponse, Error, TeachersResponse, string>(
    "teachers", // Simple string key
    fetchSenaraiGuru,
    {
      staleTime: 300000,
      refetchOnWindowFocus: true,
      ...options,
    }
  );
}
