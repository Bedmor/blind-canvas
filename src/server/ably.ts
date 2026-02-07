import Ably from "ably";
import { env } from "~/env";

const globalForAbly = globalThis as unknown as {
  ablyRest: Ably.Rest | undefined;
};

export const ablyRest =
  globalForAbly.ablyRest ?? new Ably.Rest(env.ABLY_API_KEY);

if (env.NODE_ENV !== "production") globalForAbly.ablyRest = ablyRest;
