import dbConnect from "../../../../utils/dbConnect";
import Repair from "../../../../models/Repair";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const repair = await Repair.find({ tenantid: id });
        return res.status(201).json({ success: true, data: repair });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
