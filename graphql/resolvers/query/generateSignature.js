import { createHash } from "crypto";
import Signature from "../signature.js";

// Define an asynchronous function to generate a cryptographic signature based on the provided 'id'
// The function expects an object with an 'id' property
/**
 * 
 * @param {{id: import("graphql-ws").ID}} param0 
 * @param {*} context 
 * @returns {Promise<Signature>}
 */
export async function generateSignature({ id }, context) {
  // Create a wrapper of some sort so you don't have to do this on every query
  if (!context?.isAuth) throw new Error("Error generating Signature. You are not authenticated.")
  const timestamp = Math.round((new Date()).getTime() / 1000)

  const params_to_sign = {
    public_id: id,
    timestamp
  };
  Object.entries
  const param_string = Object.entries(params_to_sign)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // Using SHA-256 for hashing instead of SHA-1
  const signature = createHash("sha256").update(param_string + process.env.CLOUDINARY_SECRET).digest("hex");


  const response = new Signature({ signature, timeStamp: timestamp }, context)
  return response;
};
