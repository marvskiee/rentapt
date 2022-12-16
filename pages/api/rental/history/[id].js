import dbConnect from "../../../../utils/dbConnect";
import Rental from "../../../../models/Rental";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const repair = await Rental.find({ tenantid: id });
        console.log(repair);
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
