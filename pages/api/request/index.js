import dbConnect from "../../../utils/dbConnect";
import Request from "../../../models/Request";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const request = await Request.find().sort({ createdAt: 1 });
        res.status(200).json({
          success: true,
          data: request,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const create = await Request.create(req.body);
        return res.status(201).json({ success: true, data: create });
      } catch (error) {
        res.status(400).json({
          success: false,
          errors: error,
        });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
