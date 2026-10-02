import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  required = false,
  error = "",
}) => {
  return (
    <div className="ui-form-group">
      <label htmlFor={name} className="ui-label">
        {label}

        {required && (
          <span
            style={{
              color: "var(--danger)",
              marginLeft: "3px",
            }}
          >
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`ui-input ${error ? "ui-input-error" : ""}`}
      />

      {error && <small className="ui-error">{error}</small>}
    </div>
  );
};

export default FormInput;
