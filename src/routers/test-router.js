import { Router } from "express";
import { logger } from "../../config/winston";

const testRouter = Router();

testRouter.get("/info", (req, res) => {
  logger.info("info test");
  res.status(200).send({
    message: "info test!",
  });
});

testRouter.get("/warn", (req, res) => {
  logger.warn("warn test");
  res.status(400).send({
    message: "warn test!",
  });
});

testRouter.get("/error", (req, res) => {
  logger.error("error test");
  res.status(500).send({
    message: "error test!",
  });
});

export { testRouter };
