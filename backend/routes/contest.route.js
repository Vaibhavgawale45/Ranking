import express from "express";
import { getContest, automatedContestDataUpdate } from "../controllers/contest.js";
const router = express.Router();
import ApiLimit from "../utils/ApiRateLimiter.js";
router.get("/upcoming", ApiLimit, getContest);
router.get("/upcomingContestupdate", ApiLimit, automatedContestDataUpdate);


export default router;
