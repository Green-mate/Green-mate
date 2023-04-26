import "dotenv/config";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

// 로그 레벨 error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
const { combine, timestamp, printf, colorize } = winston.format;

// logs 디렉토리 하위에 로그 파일 저장
const logDir = `${__dirname}/logs`;

// printf로 로그의 포맷을 지정
const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

// cimbine: 여러 포맷을 하나로 합침,
const logger = winston.createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new winstonDaily({
      // info 레벨 로그를 저장할 파일 설정
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`, //날짜로 파일명을 저장.
      maxFiles: 14, // 14일 동안 로그파일을 저장.
      zippedArchive: true, // 날짜가 지나면 로그파일을 자동으로 압축.
    }),
    // warn 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 14,
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 14,
      zippedArchive: true,
    }),
  ],
});

// production 환경이라면 최대한 자원을 안잡아 먹도록 출력 포맷 형식을 지정.
// 개발환경일 때만 콘솔에 로그 출력.
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    })
  );
}

export { logger };
