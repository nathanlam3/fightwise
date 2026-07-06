export default function CreateGameModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(114, 114, 114, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "2rem",
          width: "1000px",
          maxWidth: "90%",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 10px 30px rgba(255, 255, 255, 0.3)",
          border: "2px solid black",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            border: "none",
            background: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#888",
          }}
        >
          ✕
        </button>

        <div>
          <button
            onClick={onClose}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
              border: "2px solid black",
              background: "white",
              borderRadius: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
              e.currentTarget.style.backgroundColor = "black";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.9)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
}
