import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoMdTime } from "react-icons/io";
import { BiCalendar } from "react-icons/bi";
import { TbCalendarPlus } from "react-icons/tb";
import "./upcomingContest.css";
import codingninjalogo from "../../assests/idWFV0KNts_logos.png";
import codeforceslogo from "../../assests/icons8-codeforces.-programming-competitions-and-contests,-programming-community.-100.png";
import leetcodelogo from "../../assests/icons8-level-up-your-coding-skills-and-quickly-land-a-job-24.png";
import geeksforgeekslogo from "../../assests/icons8-geeksforgeeks-100.png";
import codecheflogo from "../../assests/icons8-codechef-100.png";
import tophlogo from "../../assests/images.jpeg";
import hackerearthlogo from "../../assests/hackerearth.jpg";
import atcoderlogo from "../../assests/atcoder.png";
import {
  fetchUpcomingContests,
  updateUpcommingContest,
} from "../../api/fetchUpcomingContest.js";
import Loader from "../Loder/Loader.jsx";

const formatDuration = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  return hours > 0
    ? minutes > 0
      ? `${hours}h ${minutes}m`
      : `${hours}h`
    : `${minutes}m`;
};

const formatDateToIST = (dateString) => {
  const date = new Date(dateString);
  const options = {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

const logoMap = {
  "toph.co": tophlogo,
  "hackerearth.com": hackerearthlogo,
  "atcoder.jp": atcoderlogo,
  "leetcode.com": leetcodelogo,
  "codingninjas.com/codestudio": codingninjalogo,
  "codechef.com": codecheflogo,
  "codeforces.com": codeforceslogo,
  "geeksforgeeks.org": geeksforgeekslogo,
};

export default function UpcomingContest() {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingContests();
        const transformedData = data.map((contest) => ({
          ...contest,
          startTime: formatDateToIST(contest.start),
          duration: contest.duration,
        }));
        setContests(transformedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch contests");
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    loadContests();
  }, [location]);

  const generateCalendarLink = (
    eventTitle,
    startTime,
    duration,
    href,
    host
  ) => {
    const startDate =
      new Date(startTime)
        .toISOString()
        .replace(/-|:|\.\d+/g, "")
        .substring(0, 15) + "Z";
    const endTime =
      new Date(new Date(startTime).getTime() + duration * 1000)
        .toISOString()
        .replace(/-|:|\.\d+/g, "")
        .substring(0, 15) + "Z";

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${startDate}/${endTime}&details=${encodeURIComponent(
      "Join here: " + href
    )}&location=${encodeURIComponent(host)}`;
  };

  if (error) return <p>{error}</p>;

  return (
    <section className="upcoming_contest">
      <div className="upcoming_contest_title">
        <h3>Upcoming Contest!</h3>
        <p className="upcoming_contest_baseLine">
          We gathered everything in one place
          {/* <span>, &nbsp;so you don't have to!</span> */}
        </p>
        <button
          className="add-button btn primary update-button" 
          onClick={() => updateUpcommingContest() }
        >
          Update
        </button>
      </div>
      <div className="table_container">
        <table className="upcoming_contest_table">
          <thead className="upcoming_contest_thead">
            <tr>
              <th>Platform</th>
              <th>Title</th>
              <th>Starts</th>
              <th>Duration</th>
              <th className="upcoming_contest_add">Add</th>
            </tr>
          </thead>
          <tbody className="table_body">
            {loading ? (
              <Loader />
            ) : (
              contests.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <div className="upcoming_contest_item">
                      <img
                        src={logoMap[entry.host] || "default-logo.png"}
                        alt={entry.host}
                        className="upcoming_contest_avatar"
                      />
                      <div className="upcoming_contest_info">
                        <p className="upcoming_contest_fw-bold">{entry.host}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="upcoming_contest_fw-normal contest_event_title">
                        {entry.event}
                      </p>
                    </a>
                  </td>
                  <td className="upcoming_contest_start_duration">
                    <span>
                      <BiCalendar />
                    </span>
                    &nbsp;
                    <span className="upcoming_contest_fw-normal">
                      {entry.startTime}
                    </span>
                  </td>
                  <td>
                    <span className="upcoming_contest_duration_icon">
                      <IoMdTime className="upcoming_contest_duration_time_icon" />
                      <p>{formatDuration(entry.duration)}</p>
                    </span>
                  </td>
                  <td>
                    <a
                      href={generateCalendarLink(
                        entry.event,
                        entry.start,
                        entry.duration,
                        entry.href,
                        entry.host
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TbCalendarPlus className="upcoming_contest_calender_icon" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
