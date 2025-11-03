import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const mobileCheck = (headers: ReadonlyHeaders): boolean => {
  const userAgent = headers.get("user-agent") || "";
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};
