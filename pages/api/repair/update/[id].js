import dbConnect from "../../../../utils/dbConnect";
import Repair from "../../../../models/Repair";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "PUT":
      try {
        const update = await Repair.findByIdAndUpdate(id, req.body);
        return res.status(201).json({ success: true, data: update });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
