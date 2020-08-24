import React from 'react'
import PropTypes from 'prop-types'


export default function InputFormControl(props) {
    const { children, ...restProps } = props
    return (
        <div className='form-group'>
            <label htmlFor={restProps.id}>{restProps.label}</label>
            {
                children ?
                    <div className="input-group mb-3">
                        <input
                            {...restProps}
                        />
                        <div className="input-group-append">
                            {children}
                        </div>
                    </div>
                    :
                    <input
                        {...restProps}
                    />
            }
        </div>

    )
}


InputFormControl.defaultProps = {
    className: 'form-control form-control-lg ',
    type: 'text',
}


InputFormControl.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}
