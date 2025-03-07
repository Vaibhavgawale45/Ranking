import apiClient from "../config/axiosConfig.js";
import { toast } from "react-toastify";

export const fetchUpcomingContests = async () => {
  try {
    console.log(process.env.REACT_APP_API_BASE_URL1);

    const response = await apiClient.get(`/api/contest/upcoming`);
    console.log(response);
    if (response.status !== 200) {
      toast.error("Something went wrong");

      return;
    }

    const contestData = response.data.contestData;
    const validHosts = [
      "toph.co",
      "hackerearth.com",
      "atcoder.jp",
      "leetcode.com",
      "codingninjas.com/codestudio",
      "codechef.com",
      "codeforces.com",
    ];

    const adjustedContestData = contestData
      .filter((contest) => validHosts.includes(contest.host))
      .map((contest) => {
        const startDate = new Date(contest.start);
        startDate.setHours(startDate.getHours() + 5);
        startDate.setMinutes(startDate.getMinutes() + 30);
        return {
          ...contest,
          start: startDate.toISOString(),
        };
      });

    adjustedContestData.sort((a, b) => new Date(a.start) - new Date(b.start));

    const adjustedResponse = {
      ...response.data,
      contestData: {
        ...contestData,
        objects: adjustedContestData,
      },
    };
    console.log(adjustedResponse);
    return adjustedResponse.contestData.objects;
  } catch (error) {
    console.error("Error fetching upcoming contests:", error);

    throw error;
  }
};

export const updateUpcommingContest = async () => {
  try {
    const response = await apiClient.get(`/api/contest/upcomingContestupdate`);

    if (response.status === 200) {
      toast.success("Upcomming Contest Updated!");
    } else if (response.status === 401) {
      toast.error("Upcomming Contest Failed to Update");
    } 
  }catch (error) {
    console.error("Error fetching upcoming contests:", error);

    throw error;
  }
};
