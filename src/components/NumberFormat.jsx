import React from 'react'
import PropTypes from 'prop-types'
import CurrencyFormat from 'react-currency-format'

export default function NumberFormat(props) {
    return (
        <CurrencyFormat  {...props} />
    )
}


NumberFormat.defaultProps = {
    displayType: 'text',
    prefix: 'R$ ',
    decimalSeparator: ',',
    thousandSeparator: '.',
    decimalScale: 2,
    fixedDecimalScale: true,
}


NumberFormat.propTypes = {
    value: PropTypes.number.isRequired
}
