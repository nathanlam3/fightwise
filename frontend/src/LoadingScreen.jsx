import fw_logo2 from "./assets/logos/fw_logo2.png";
import { motion } from "framer-motion";

export default function LoadingScreen({ visible }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        background: "white",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 500ms ease",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          gap: "1rem",
        }}
      >
        <motion.img
          layoutId="fw-logo"
          src={fw_logo2}
          alt="FW Logo"
          style={{
            width: "220px",
            height: "auto",
          }}
        />

        <div
          style={{
            width: "200px",
            height: "20px",
            background: "#ffffff",
            border: "2px solid #000000",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              borderRadius: "5px",
              animation: "slide 1.25s ease-in-out infinite, colorShift 2.5s ease-in-out infinite",
            }}
          />
        </div>

        <style>{`
               @keyframes slide {
                 0% {
                   transform: translateX(-200%);
                 }
                 100% {
                   transform: translateX(200%);
                 }
               }
     
               @keyframes colorShift {
                 0%, 45% {
                   background: #d32f2f;
                 }
                 50%, 95% {
                   background: #1976d2;
                 }
                 100% {
                   background: #d32f2f;
                 }
               }
             `}</style>
      </div>
    </div>
  );
}
