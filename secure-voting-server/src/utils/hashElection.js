import { DEFAULT_CIPHERS } from "tls";
import crypto  from "crypto";

export const hashElection = (data) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
};

