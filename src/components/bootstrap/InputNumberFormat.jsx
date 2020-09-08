import React from 'react'
import PropTypes from 'prop-types'
import CurrencyFormat from 'react-currency-format'

export default function InputNumberFormat(props) {
  const { label, prefix, ...restProps } = props

  return (
    <div className="form-group">
      <label htmlFor={restProps.id}>{label}</label>
      { prefix === "" ? (
      <CurrencyFormat {...restProps} />
    ) : (
      <div className="input-group mb-3">
       
        <div className="input-group-prepend">
          <span className="input-group-text">{prefix}</span>
        </div>
        <CurrencyFormat {...restProps} />
      </div>
    ) }
    </div>
  )
}


InputNumberFormat.defaultProps = {
  className: 'form-control',
  type: 'text',
  prefix: 'R$ ',
  decimalSeparator: ',',
  thousandSeparator: '.',
}


InputNumberFormat.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}
