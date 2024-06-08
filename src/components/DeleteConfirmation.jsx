import { useEffect } from "react";
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };

    // I am using function as a dependencies (i.e. onConfirm). That make infinite loop. When dependencies are number or string , the effect fn would be run again if that no or string changed. But when I am using fn it is tricky bcz this onconfirm is defined in the app com as handleRemovePlace
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
