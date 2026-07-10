import { useState } from "react";

export default function CreateGameModal({
  onClose,
  onSubmit,
  onDelete,
  numFighters,
  players,
  setPlayers,
  draftMode,
  setDraftMode,
  draftOrderSetting,
  setDraftOrderSetting,
  gameCreated,
}) {
  const [tempPlayers, setTempPlayers] = useState(players);
  const [selectedDraftMode, setSelectedDraftMode] = useState(draftMode);
  const [selectedDraftOrderSetting, setSelectedDraftOrderSetting] = useState(draftOrderSetting);

  const maxPlayers = Math.floor(numFighters / 3);
  const minPlayers = 2;

  const canAddRow = tempPlayers.length < maxPlayers;
  const canRemoveRow = tempPlayers.length > minPlayers;

  const addRow = () => {
    if (!canAddRow) return;
    const nextId = tempPlayers.length > 0 ? Math.max(...tempPlayers.map((p) => p.id)) + 1 : 1;
    setTempPlayers([...tempPlayers, { id: nextId, name: "", drafted_fighters: [] }]);
  };

  const removeRow = (id) => {
    if (!canRemoveRow) return;
    setTempPlayers(tempPlayers.filter((p) => p.id !== id));
  };

  const updateName = (id, name) => {
    setTempPlayers(tempPlayers.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const updateDraftMode = (draftMode) => {
    setDraftMode(draftMode);
  };

  const sortedTempPlayers = [...tempPlayers].sort((a, b) => a.id - b.id);
  const allNamesFilled = tempPlayers.every((p) => p.name.trim() !== "");
  const hasDuplicateNames =
    new Set(tempPlayers.map((p) => p.name.trim().toLowerCase()).filter((name) => name !== ""))
      .size !== tempPlayers.filter((p) => p.name.trim() !== "").length;

  const hasChanges =
    JSON.stringify(tempPlayers) !== JSON.stringify(players) ||
    selectedDraftMode !== draftMode ||
    selectedDraftOrderSetting !== draftOrderSetting;

  const isValid = allNamesFilled && !hasDuplicateNames && (!gameCreated || hasChanges);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setDraftMode(selectedDraftMode);
    setDraftOrderSetting(selectedDraftOrderSetting);

    let orderedTempPlayers = [...tempPlayers];
    if (selectedDraftOrderSetting === "Random") {
      for (let i = orderedTempPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [orderedTempPlayers[i], orderedTempPlayers[j]] = [
          orderedTempPlayers[j],
          orderedTempPlayers[i],
        ];
      }
    } else {
      orderedTempPlayers = [...sortedTempPlayers];
    }
    setPlayers(orderedTempPlayers);
    onSubmit();
    onClose();
  };

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
          padding: "2.5rem",
          width: "1000px",
          maxWidth: "90%",
          maxHeight: "85vh",
          overflowY: "auto",
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

        <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          {gameCreated ? "Update Game" : "Create Game"}
        </h2>

        <p style={{ color: "#888", marginTop: 0, marginBottom: "1rem", fontSize: "0.9rem" }}>
          Set draft mode
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "2px solid black",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedDraftMode("Serpentine")}
              style={{
                padding: "0.6rem 1.2rem",
                border: "none",
                cursor: "pointer",
                background: selectedDraftMode === "Serpentine" ? "black" : "white",
                color: selectedDraftMode === "Serpentine" ? "white" : "black",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              Serpentine
            </button>

            <button
              type="button"
              onClick={() => setSelectedDraftMode("Fixed")}
              style={{
                padding: "0.6rem 1.2rem",
                border: "none",
                cursor: "pointer",
                background: selectedDraftMode === "Fixed" ? "black" : "white",
                color: selectedDraftMode === "Fixed" ? "white" : "black",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              Fixed
            </button>
          </div>
        </div>

        <p style={{ color: "#888", marginTop: 0, marginBottom: "1rem", fontSize: "0.9rem" }}>
          Set draft order
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "2px solid black",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedDraftOrderSetting("Random")}
              style={{
                padding: "0.6rem 1.2rem",
                border: "none",
                cursor: "pointer",
                background: selectedDraftOrderSetting === "Random" ? "black" : "white",
                color: selectedDraftOrderSetting === "Random" ? "white" : "black",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              Random
            </button>

            <button
              type="button"
              onClick={() => setSelectedDraftOrderSetting("InOrder")}
              style={{
                padding: "0.6rem 1.2rem",
                border: "none",
                cursor: "pointer",
                background: selectedDraftOrderSetting === "InOrder" ? "black" : "white",
                color: selectedDraftOrderSetting === "InOrder" ? "white" : "black",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
            >
              In Order
            </button>
          </div>
        </div>

        <p style={{ color: "#888", marginTop: 0, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          Add between {minPlayers} and {maxPlayers} players
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {sortedTempPlayers.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#f2f2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#555",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>

                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updateName(player.id, e.target.value)}
                  placeholder={`Player ${index + 1} name`}
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.9rem",
                    fontSize: "1rem",
                    border: "2px solid #ddd",
                    borderRadius: "10px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "black")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />

                <button
                  type="button"
                  onClick={() => removeRow(player.id)}
                  disabled={!canRemoveRow}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "2px solid #ddd",
                    background: "white",
                    color: canRemoveRow ? "#c0392b" : "#ccc",
                    fontSize: "1rem",
                    cursor: canRemoveRow ? "pointer" : "not-allowed",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={!canAddRow}
            style={{
              marginTop: "0.8rem",
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              cursor: canAddRow ? "pointer" : "not-allowed",
              border: "2px dashed #ccc",
              background: "white",
              color: canAddRow ? "#333" : "#ccc",
              borderRadius: "10px",
              width: "100%",
            }}
          >
            {canAddRow ? "+ Add Player" : `Maximum ${maxPlayers} players reached`}
          </button>

          {hasDuplicateNames && (
            <p style={{ color: "#c0392b", fontSize: "0.85rem", marginTop: "0.8rem" }}>
              Player names must be unique.
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid}
            style={{
              marginTop: "1.5rem",
              padding: "0.7rem 1.2rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              border: "2px solid black",
              background: isValid ? "white" : "#f2f2f2",
              color: isValid ? "black" : "#aaa",
              borderRadius: "10px",
              width: "100%",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isValid) return;
              e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
              e.currentTarget.style.backgroundColor = "black";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              if (!isValid) return;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseDown={(e) => {
              if (!isValid) return;
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              if (!isValid) return;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {gameCreated ? "Update Game" : "Create Game"}
          </button>
          {gameCreated && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "This will permanently delete the game and reset all players. Continue?"
                  )
                ) {
                  onDelete();
                  onClose();
                }
              }}
              style={{
                marginTop: "0.8rem",
                padding: "0.6rem 1.2rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "2px solid #c0392b",
                background: "white",
                color: "#c0392b",
                borderRadius: "10px",
                width: "100%",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c0392b";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "#c0392b";
              }}
            >
              Delete Game
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
