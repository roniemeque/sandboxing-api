import { NextApiRequest, NextApiResponse } from "next";

const handleCors = (req: NextApiRequest, res: NextApiResponse): boolean => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.status(200).json("Ok");
    return true;
  }
  return false;
};

export default handleCors;
