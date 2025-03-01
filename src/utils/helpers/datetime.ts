import { months } from "@src/lib/constant";

/**
 * Calculates the current week number since the start of the school term (Feb 17, 2025)
 * @param {string} startDate - The start date of the school term in YYYY-MM-DD format
 * @returns {number} - The current week number (1-based)
 */
export const calculateCurrentWeek = (
  startDate: string = "2025-02-17"
): number => {
  const start = new Date(startDate);
  const today = new Date();

  // Reset time components to ensure accurate day calculation
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate week number (add 1 to start counting from week 1)
  const weekNumber = Math.floor(diffDays / 7) + 1;

  // Return 1 if the calculation results in zero or negative (meaning we're before the start date)
  return weekNumber > 0 ? weekNumber : 1;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
