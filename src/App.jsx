import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";
import { useState } from "react";

function App() {
  const [sidebar, setSidebar] = useState(false);
  return (
    <div className="app">
      <Navbar setSidebar={setSidebar} sidebar={sidebar} />
      {/* <Sidebar sidebar={sidebar} /> */}
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
    </div>
  );
}

export default App;
