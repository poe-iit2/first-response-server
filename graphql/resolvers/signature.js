// Define a 'Signature' class to encapsulate signature-related operations and data
export default class Signature {
  constructor({ signature, timeStamp }, context) {
    if (!context?.isAuth) throw new Error("Error retrieving Signature data. You are not authenticated.")
    this.context = context
    this.signature = signature
    this.timeStamp = timeStamp
  }

  context;
  signature;
  timeStamp;
}
