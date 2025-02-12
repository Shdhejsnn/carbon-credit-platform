
import "./PopupModal.css";

// Define TypeScript types for props
interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to GreenLedger</h2>
        <p>Register or login to continue</p>
        <div className="modal-buttons">
          <button className="btn register">Register</button>
          <button className="btn login">Login</button>
        </div>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default PopupModal;
