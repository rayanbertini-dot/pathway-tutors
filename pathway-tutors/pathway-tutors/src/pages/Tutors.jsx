import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const SUBJECTS = ["All", "Math", "English / Writing", "Science", "History", "Reading", "Test Prep (SAT/ACT)"];

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      try {
        const q = query(collection(db, "users"), where("role", "==", "tutor"));
        const snap = await getDocs(q);
        setTutors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchTutors();
  }, []);

  const filtered = tutors.filter(t => {
    const subjectMatch = filter === "All" || (t.subjects || []).includes(filter);
    const langMatch = langFilter === "All" || t.language === langFilter;
    return subjectMatch && langMatch;
  });

  function handleBook(tutorId) {
    if (!currentUser) return navigate("/signup?role=student");
    navigate(`/book/${tutorId}`);
  }

  return (
    <div style={{ padding: "40px 0", minHeight: "100vh" }}>
      <div className="page-container">
        <h1 style={styles.title}>Find a Tutor</h1>
        <p style={styles.subtitle}>Browse volunteer tutors and book a free 1-on-1 Zoom session.</p>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Subject:</label>
            <div style={styles.filterPills}>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    ...styles.filterPill,
                    background: filter === s ? "var(--green)" : "white",
                    color: filter === s ? "white" : "var(--text-muted)",
                    borderColor: filter === s ? "var(--green)" : "var(--border)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Language:</label>
            <div style={styles.filterPills}>
              {["All", "English", "Spanish"].map(l => (
                <button
                  key={l}
                  onClick={() => setLangFilter(l)}
                  style={{
                    ...styles.filterPill,
                    background: langFilter === l ? "var(--green)" : "white",
                    color: langFilter === l ? "white" : "var(--text-muted)",
                    borderColor: langFilter === l ? "var(--green)" : "var(--border)",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3>No tutors found</h3>
            <p style={{ color: "var(--text-muted)" }}>Try a different filter, or check back soon as more tutors join!</p>
            <Link to="/signup?role=tutor" className="btn btn-primary" style={{ marginTop: 16 }}>
              Become a tutor
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(tutor => (
              <div key={tutor.id} className="card" style={styles.tutorCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatar}>{tutor.firstName?.[0] || "T"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.tutorName}>{tutor.displayName || `${tutor.firstName} ${tutor.lastName}`}</div>
                    <div style={styles.tutorGrade}>Grade {tutor.gradeLevel}</div>
                  </div>
                  <span className="badge badge-green">Available</span>
                </div>

                {tutor.bio && (
                  <p style={styles.bio}>{tutor.bio}</p>
                )}

                <div style={styles.subjects}>
                  {(tutor.subjects || []).map(s => (
                    <span key={s} className="tag" style={{ fontSize: 12 }}>{s}</span>
                  ))}
                </div>

                <div style={styles.cardMeta}>
                  {tutor.language && (
                    <span style={styles.metaItem}>🗣️ {tutor.language}</span>
                  )}
                  {tutor.availability && (
                    <span style={styles.metaItem}>📅 {tutor.availability}</span>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
                  onClick={() => handleBook(tutor.id)}
                >
                  Book a Session
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Request form link for students */}
        <div style={styles.requestBanner}>
          <div>
            <strong>Can't find what you need?</strong>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
              Submit a session request and we'll match you with the right tutor.
            </p>
          </div>
          <Link to="/request" className="btn btn-outline">Request a Tutor</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 8 },
  subtitle: { color: "var(--text-muted)", fontSize: 16, marginBottom: 32 },
  filters: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 },
  filterGroup: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  filterLabel: { fontSize: 14, fontWeight: 600, minWidth: 70 },
  filterPills: { display: "flex", flexWrap: "wrap", gap: 8 },
  filterPill: {
    padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
    border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 },
  tutorCard: { display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: "50%", background: "var(--green-light)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, fontWeight: 600, color: "var(--green)", flexShrink: 0,
  },
  tutorName: { fontWeight: 600, fontSize: 16 },
  tutorGrade: { fontSize: 13, color: "var(--text-muted)" },
  bio: { fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 },
  subjects: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 },
  cardMeta: { display: "flex", flexDirection: "column", gap: 4 },
  metaItem: { fontSize: 13, color: "var(--text-muted)" },
  empty: { textAlign: "center", padding: "60px 0" },
  requestBanner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "var(--green-light)", border: "1px solid #86efac",
    borderRadius: 12, padding: "20px 24px", marginTop: 48, flexWrap: "wrap", gap: 16,
  },
};
