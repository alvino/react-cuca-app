import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputGroup } from 'react-bootstrap'
import CurrencyFormat from 'react-currency-format'

export default function InputNumberFormat(props) {
  const { id, label, prefix, ...restProps } = props


  return (
    <Form.Group controlId={id}>
      <Form.Label>{label}</Form.Label>
      { prefix === "" ? (
      <CurrencyFormat {...restProps} />
    ) : (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>{prefix}</InputGroup.Text>
        </InputGroup.Prepend>
        <CurrencyFormat {...restProps} />
      </InputGroup>
    ) }
    </Form.Group>
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
