import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mentorRouter from "./mentor";
import analyticsRouter from "./analytics";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mentorRouter);
router.use(analyticsRouter);
router.use(authRouter);

export default router;
