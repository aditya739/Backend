import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import VideoPage from "./pages/VideoPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Upload from "./pages/Upload.jsx";
import Collections from "./pages/Collections.jsx";
import Trending from "./pages/Trending.jsx";
import { AuthProvider } from "./services/auth.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#fafafa]">
            <Nav />
            <main className="max-w-6xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/videos/:id" element={<VideoPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/trending" element={<Trending />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  );
}
