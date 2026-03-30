module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { subject, studentName, date, time } = req.body;

  const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
  const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

  try {
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(500).json({ error: "Failed to get Zoom token", details: tokenData });
    }

    function convertTime(timeStr) {
      const [time, period] = timeStr.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
    }

    const meetingRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: `PathwayTutors: ${subject} with ${studentName}`,
        type: 2,
        start_time: `${date}T${convertTime(time)}`,
        duration: 60,
        timezone: "America/New_York",
        settings: { join_before_host: true, waiting_room: false },
      }),
    });

    const meetingData = await meetingRes.json();
    if (!meetingData.join_url) {
      return res.status(500).json({ error: "Failed to create Zoom meeting", details: meetingData });
    }

    return res.status(200).json({ zoomLink: meetingData.join_url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
