import React from "react";
import PropTypes from "prop-types";

InputFormControl.defaultProps = {
  className: "form-control ",
  type: "text",
};

InputFormControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default function InputFormControl(props) {
  const { children, label, ...restProps } = props;
  
  return (
    <div className="form-group">
      <label htmlFor={restProps.id}>{label}</label>
      {children ? (
      <div className="input-group mb-3">
        <input {...restProps} />
        <div className="input-group-append">{children}</div>
      </div>
    ) : (
      <input {...restProps} />
    )}
    </div>
  );
}
