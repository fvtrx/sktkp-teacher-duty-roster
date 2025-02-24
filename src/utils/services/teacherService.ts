import api from "./api";
import { TeachersResponse } from "@src/pages/api/senarai-guru";

// Teacher API service
export const teacherService = {
  /**
   * Get all teachers
   * @returns Promise with teacher data
   */
  getTeachers: async (): Promise<TeachersResponse> => {
    const response = await api.get<TeachersResponse>("/api/senarai-guru");
    return response.data;
  },

  /**
   * Get a teacher by ID (placeholder for future expansion)
   * @param id Teacher ID
   * @returns Promise with teacher data
   */
  getTeacherById: async (id: string) => {
    const response = await api.get(`/api/senarai-guru/${id}`);
    return response.data;
  },

  /**
   * Create a new teacher (placeholder for future expansion)
   * @param teacherData Teacher data
   * @returns Promise with created teacher
   */
  createTeacher: async (teacherData: any) => {
    const response = await api.post("/api/senarai-guru", teacherData);
    return response.data;
  },

  /**
   * Update a teacher (placeholder for future expansion)
   * @param id Teacher ID
   * @param teacherData Teacher data to update
   * @returns Promise with updated teacher
   */
  updateTeacher: async (id: string, teacherData: any) => {
    const response = await api.put(`/api/senarai-guru/${id}`, teacherData);
    return response.data;
  },

  /**
   * Delete a teacher (placeholder for future expansion)
   * @param id Teacher ID
   * @returns Promise with deletion result
   */
  deleteTeacher: async (id: string) => {
    const response = await api.delete(`/api/senarai-guru/${id}`);
    return response.data;
  },
};

export default teacherService;
