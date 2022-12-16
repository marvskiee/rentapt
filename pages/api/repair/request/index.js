import dbConnect from "../../../../utils/dbConnect";
import Repair from "../../../../models/Repair";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const repair = await Repair.find({ status: "pending" }).sort({
          unit: 1,
        });
        res.status(200).json({
          success: true,
          data: repair,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
