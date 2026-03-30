import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Tutors from "./pages/Tutors";
import BookSession from "./pages/BookSession";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import About from "./pages/About";
import RequestTutor from "./pages/RequestTutor";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userProfile } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to={userProfile?.role === "tutor" ? "/tutor-dashboard" : "/student-dashboard"} />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/about" element={<About />} />
        <Route path="/request" element={<RequestTutor />} />
        <Route path="/book/:tutorId" element={
          <ProtectedRoute>
            <BookSession />
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/tutor-dashboard" element={
          <ProtectedRoute requiredRole="tutor">
            <TutorDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
