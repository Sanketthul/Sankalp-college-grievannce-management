import React from "react";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`ui-btn ui-btn-${variant} ${className}`}
    >
      {loading ? (
        <>
          <span className="button-spinner" />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
