import React from 'react'
import PropTypes from 'prop-types'


export default function SelectFormControl(props) {

    return (
        <div className='form-group'>
            <label htmlFor={props.id}>{props.label}</label>
            <select {...props}>
                {props.children}
            </select>
        </div>
    )
}


SelectFormControl.defaultProps = {
    className: 'form-control ',
    type: 'select',
}


SelectFormControl.propTypes = {
    label: PropTypes.string.isRequired
}
