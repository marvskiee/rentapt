export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const URI = "https://api.semaphore.co/api/v4/priority";
        await fetch(URI, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            message: req.body?.message,
            number: "639959151063",
            apikey: process.env.SMS_API,
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            return res.status(200).json({ success: true, data: response });
          })
          .catch((e) => {
            return res.status(500).json({ success: false, error: e });
          });
      } catch (e) {
        res.status(500).json({ success: false, error: e });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
