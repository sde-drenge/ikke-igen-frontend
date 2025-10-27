import { environment } from "@/config/environment";

import crypto from "node:crypto";
import "server-only";

export function decryptData(encryptedData: string) {
  const privateKey = environment.PRIVATE_KEY_PEM;
  const buffer = Buffer.from(encryptedData, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return JSON.parse(decrypted.toString("utf8"));
}
