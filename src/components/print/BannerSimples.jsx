import React from "react";


import Logo from "../Logo"

export default () => (
  <div
    className="bg-primary 
          d-flex-column 
          text-white d-flex 
          justify-content-between 
          align-items-center p-3"
  >
    <div className="justify-content-center">
      <div className="d-flex justify-content-center">
        <Logo />
      </div>
    </div>
    <div className="text-center ml-2">
      <span className="h5 font-italic">Para Crescer,</span>
      <span className="h5 font-weight-bold"> Use a Cuca.</span>
    </div>

    <div>
      <div className="text-center">
        <span className="">MARKETING & PROPAGANDA</span>
      </div>
      <div className="text-center">
        <span className="">FOTOS & FILMAGENS</span>
      </div>
      <div className="text-center">
        <span className="h5 font-weight-bold">CNPJ: 28.110.511/0001-85</span>
      </div>
    </div>
  </div>
);