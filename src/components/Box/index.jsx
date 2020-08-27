import React from 'react'
import { Link } from 'react-router-dom'

import './style.css'

export default function (props) {
    return (
        <Link
            to={props.to}
            className="box d-flex m-3 rounded-lg shadow-lg text-white"
        >

            <div className='d-flex flex-column justify-content-center align-items-center' >
                <div className="d-flex">
                    {props.children}
                </div>

                <h3 className='mt-2'>
                    {props.title}
                </h3>
            </div>
        </Link >
    )
}