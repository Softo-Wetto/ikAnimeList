import "server-only";

type LogData = Record<string, string | number | boolean | null | undefined>;

function write(level: "info" | "warn" | "error", event: string, data: LogData = {}) {
  const entry = JSON.stringify({ level, event, timestamp: new Date().toISOString(), ...data });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}

export const logger = {
  info: (event: string, data?: LogData) => write("info", event, data),
  warn: (event: string, data?: LogData) => write("warn", event, data),
  error: (event: string, data?: LogData) => write("error", event, data)
};
