import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ZOOM_ACCOUNT_ID = "d3KMA0qQle9-B7D3ksiJw";
const ZOOM_CLIENT_ID = "voMxDT21RTaHXPVUo3pBnQ";
const ZOOM_CLIENT_SECRET = "4zsKgo828cNw8Y0PcUPNzQB9KmkRXzKQ";

async function generateZoomLink(session) {
  try {
    // Get Zoom access token
    const tokenRes = await fetch("https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + ZOOM_ACCOUNT_ID, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token");

    // Create meeting
    const meetingRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: `PathwayTutors: ${session.subject} with ${session.studentName}`,
        type: 2, // Scheduled
        start_time: `${session.date}T${convertTime(session.time)}`,
        duration: 60,
        timezone: "America/New_York",
        settings: { join_before_host: true, waiting_room: false },
      }),
    });
    const meetingData = await meetingRes.json();
    return meetingData.join_url;
  } catch (e) {
    console.error("Zoom error:", e);
    // Fallback: return a placeholder link
    return `https://zoom.us/j/pathway-${session.id}`;
  }
}

function convertTime(timeStr) {
  const [time, period] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`;
}

export default function TutorDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    loadSessions();
  }, [currentUser]);

  async function loadSessions() {
    if (!currentUser) return;
    try {
      const q = query(collection(db, "sessions"), where("tutorId", "==", currentUser.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.date > b.date ? 1 : -1));
      setSessions(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function confirmSession(session) {
    setConfirming(session.id);
    try {
      const zoomLink = await generateZoomLink(session);
      await updateDoc(doc(db, "sessions", session.id), {
        status: "confirmed",
        zoomLink,
      });
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: "confirmed", zoomLink } : s
      ));
    } catch (e) {
      console.error(e);
    }
    setConfirming(null);
  }

  async function cancelSession(sessionId) {
    await updateDoc(doc(db, "sessions", sessionId), { status: "cancelled" });
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: "cancelled" } : s));
  }

  async function completeSession(sessionId) {
    await updateDoc(doc(db, "sessions", sessionId), { status: "completed" });
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: "completed" } : s));
  }

  const pending = sessions.filter(s => s.status === "pending");
  const confirmed = sessions.filter(s => s.status === "confirmed");
  const past = sessions.filter(s => s.status === "completed" || s.status === "cancelled");

  return (
    <div style={styles.page}>
      <div className="page-container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Tutor Dashboard 👩‍🏫</h1>
            <p style={styles.subtitle}>Welcome back, {userProfile?.firstName}!</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div className="card" style={styles.stat}>
            <div style={styles.statNum}>{pending.length}</div>
            <div style={styles.statLabel}>Pending Requests</div>
          </div>
          <div className="card" style={styles.stat}>
            <div style={styles.statNum}>{confirmed.length}</div>
            <div style={styles.statLabel}>Upcoming</div>
          </div>
          <div className="card" style={styles.stat}>
            <div style={styles.statNum}>{past.filter(s => s.status === "completed").length}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Pending requests */}
            {pending.length > 0 && (
              <>
                <h2 style={styles.sectionTitle}>⏳ Pending Requests</h2>
                <div style={styles.list}>
                  {pending.map(s => (
                    <div key={s.id} className="card" style={styles.sessionCard}>
                      <div style={styles.sessionTop}>
                        <div>
                          <div style={styles.sessionSubject}>{s.subject}</div>
                          <div style={styles.sessionMeta}>Student: {s.studentName}</div>
                          <div style={styles.sessionDate}>📅 {s.date} · ⏰ {s.time}</div>
                        </div>
                        <span className="badge badge-gold">Pending</span>
                      </div>
                      {s.notes && (
                        <div style={styles.notes}>
                          <strong>Student note:</strong> {s.notes}
                        </div>
                      )}
                      <div style={styles.actions}>
                        <button
                          className="btn btn-primary"
                          onClick={() => confirmSession(s)}
                          disabled={confirming === s.id}
                          style={{ fontSize: 14 }}
                        >
                          {confirming === s.id ? "Creating Zoom..." : "✅ Confirm + Create Zoom Link"}
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => cancelSession(s.id)}
                          style={{ fontSize: 14, color: "#dc2626" }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Confirmed upcoming */}
            <h2 style={{ ...styles.sectionTitle, marginTop: pending.length > 0 ? 40 : 0 }}>✅ Upcoming Sessions</h2>
            {confirmed.length === 0 ? (
              <div className="card" style={styles.empty}>
                <p>No upcoming sessions yet.</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
                  Make sure your profile is visible so students can find and book you!
                </p>
              </div>
            ) : (
              <div style={styles.list}>
                {confirmed.map(s => (
                  <div key={s.id} className="card" style={styles.sessionCard}>
                    <div style={styles.sessionTop}>
                      <div>
                        <div style={styles.sessionSubject}>{s.subject}</div>
                        <div style={styles.sessionMeta}>Student: {s.studentName}</div>
                        <div style={styles.sessionDate}>📅 {s.date} · ⏰ {s.time}</div>
                      </div>
                      <span className="badge badge-green">Confirmed</span>
                    </div>
                    {s.zoomLink && (
                      <a href={s.zoomLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: 12, fontSize: 14, display: "inline-flex" }}>
                        📹 Start Zoom Meeting
                      </a>
                    )}
                    <div style={{ marginTop: 12 }}>
                      <button className="btn btn-ghost" onClick={() => completeSession(s.id)} style={{ fontSize: 13 }}>
                        Mark as completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <>
                <h2 style={{ ...styles.sectionTitle, marginTop: 40 }}>Past Sessions</h2>
                <div style={styles.list}>
                  {past.map(s => (
                    <div key={s.id} className="card" style={{ ...styles.sessionCard, opacity: 0.7 }}>
                      <div style={styles.sessionTop}>
                        <div>
                          <div style={styles.sessionSubject}>{s.subject}</div>
                          <div style={styles.sessionMeta}>Student: {s.studentName}</div>
                          <div style={styles.sessionDate}>📅 {s.date} · ⏰ {s.time}</div>
                        </div>
                        <span className={`badge ${s.status === "completed" ? "badge-gray" : "badge-gray"}`}>
                          {s.status === "completed" ? "✓ Completed" : "✕ Cancelled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px 0", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 },
  title: { fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 4 },
  subtitle: { color: "var(--text-muted)", fontSize: 15 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 },
  stat: { textAlign: "center" },
  statNum: { fontFamily: "var(--font-display)", fontSize: 36, color: "var(--green)" },
  statLabel: { fontSize: 13, color: "var(--text-muted)", marginTop: 4 },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  sessionCard: {},
  sessionTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  sessionSubject: { fontWeight: 600, fontSize: 17 },
  sessionMeta: { color: "var(--text-muted)", fontSize: 14, marginTop: 2 },
  sessionDate: { fontSize: 13, color: "var(--text-muted)", marginTop: 4 },
  notes: { background: "var(--bg)", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 12 },
  actions: { display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" },
  empty: { textAlign: "center", padding: 32 },
};
