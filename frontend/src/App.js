import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./pages/CreateProject";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/create" element={<CreateProject />} />
            {/* Placeholder routes */}
            <Route path="/category/:category" element={<Discover />} />
            <Route path="/search" element={<Discover />} />
            <Route path="/profile" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">Profile Page - Coming Soon</h1></div>} />
            <Route path="/backed" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">Backed Projects - Coming Soon</h1></div>} />
            <Route path="/settings" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
            <Route path="/about" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">About Us - Coming Soon</h1></div>} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;