import React from 'react'
import PropTypes from 'prop-types'

export default function DateFormat(props) {
    const {value, split, separator} = props
    const [year, moth, data] = String(value).substring(0,10).split(split)
    return (
    <span>{[data,moth,year].join(separator)}</span>
    )
}


DateFormat.defaultProps = {
   split: '-',
   separator: '/'
}


DateFormat.propTypes = {
    value: PropTypes.string.isRequired
}
