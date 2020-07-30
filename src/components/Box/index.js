import React from 'react'
import { Link } from 'react-router-dom'

import './style.css'

export default function (props) {
    return (
        <Link
            to={props.to}
            className="box d-flex m-3 rounded-lg shadow-lg text-white"
        >

            <div
                className='d-flex justify-content-center align-items-center'
            >
                <h3>
                    {props.title}
                </h3>
            </div>
        </Link >
    )
}
