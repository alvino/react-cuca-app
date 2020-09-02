import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// import './Box.css'
const Anchor = styled.a`
  opacity: 0.6;
  width: 12rem;
  height: 12rem;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transition: all 0.35s;
  text-decoration: none;

  &:hover {
    opacity: 1;
    text-decoration: none;
    -moz-transform: scale(1.2);
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }

  svg {
    width: 5rem;
    height: 5rem;
  }
`;



export default function (props) {
  return (
    <Anchor
      as={Link}
      to={props.to}
      className="m-3 text-white d-flex rounded justify-content-center align-items-center shadow bg-primary"
    >
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex size-box">{props.children}</div>

        <div className="mt-2 h4">{props.title}</div>
      </div>
    </Anchor>
  );
}
