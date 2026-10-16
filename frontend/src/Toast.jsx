
import { useEffect } from "react";

function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type}`} role="alert">
      <span className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </span>

      <div className="toast-content">
        <strong>
          {type === "success" ? "Success" : "Something went wrong"}
        </strong>
        <p>{message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;