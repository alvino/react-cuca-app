import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// import './Box.css'
const Anchor = styled.a`
  border-radius: 0.3rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  color: #fff;
  display: flex;
  margin: 1rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 12rem;
  height: 12rem;
  background-color: rgba(0, 123, 255, 0.7);
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  text-decoration: none;

  &:hover {
    color: #fff;
    text-decoration: none;
    background-color: rgb(0, 123, 255);
    -moz-transform: scale(1.2);
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }

  svg {
    width: 5rem;
    height: 5rem;
  }
`;

//className = "d-flex m-3 rounded-lg shadow-lg text-white";

export default function (props) {
  return (
    <Anchor as={Link} to={props.to}>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex size-box">{props.children}</div>

        <div className="mt-2 h4">{props.title}</div>
      </div>
    </Anchor>
  );
}
