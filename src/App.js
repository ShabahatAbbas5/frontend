import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import from react-router-dom
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Resources from "./components/Resources";
import Prevention from "./components/Prevention";
import Education from "./components/Education";
import Permits from "./components/Permits";
import News from "./components/News";
import PublicRecords from "./components/Public Records";
import Elections from "./components/Elections";
import RecruitmentAndHiring from "./components/Recruitment & Hiring";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Wrap your app with BrowserRouter */}
      <div className="App">
        <div className="content-wrapper">
          <Header />
          <Routes>
            {" "}
            {/* Define your routes */}
            <Route path="/" element={<Home />} /> {/* Home img route */}
            <Route path="/home" element={<Home />} /> {/* Home route */}
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/education" element={<Education />} />
            <Route path="/permits" element={<Permits />} />
            <Route path="/news" element={<News />} />
            <Route path="/public-records" element={<PublicRecords />} />
            <Route path="/elections" element={<Elections />} />
            <Route
              path="/recruitment-and-hiring"
              element={<RecruitmentAndHiring />}
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
