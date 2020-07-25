import React from 'react'
import { Link } from 'react-router-dom'

export default function Box(props) {
    return (
        <Link
            to={props.to}
            className="badge badge-primary m-3 shadow text-white"
            style={{
                backgroundColor: 'rgba(0, 123, 255,0.7)',
            }}
        >

            <div
                className='d-flex justify-content-center align-items-center'
                style={{
                    width: '13rem',
                    height: '13rem',
                }}>
                <h3>
                    {props.title}
                </h3>
            </div>
        </Link >
    )
}
