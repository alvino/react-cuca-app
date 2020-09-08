import React from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaMapMarkedAlt,
} from "react-icons/fa";


import qrcodeWhats from "../../assert/whatsapp.png";
import logoCuca from "../../assert/logo_cuca.svg";

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
        <img src={logoCuca} height="100px" alt="logo" />
      </div>
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
    <div className="text-center ml-2">
      <span className="h5 font-italic">Para Crescer,</span>
      <span className="h5 font-weight-bold"> Use a Cuca.</span>
    </div>
    <div className="d-flex justify-content-center">
      <img src={qrcodeWhats} height="90px" alt="whatsapp" />
    </div>
    <div>
      <div className="text-monospace">
        <FaPhone className="mx-2" />
        62
        <span className="  mx-2">3383-3046</span>
      </div>
      <div className="text-monospace">
        <FaWhatsapp className="mx-2" />
        62
        <span className="  mx-2">98314-8780</span>
      </div>
      <div className="text-monospace">
        <FaWhatsapp className="mx-2" />
        62
        <span className="  mx-2">98204-0184</span>
      </div>
      <div>
        <FaEnvelope className="mx-2" />
        <span>cuca_altohorizonte@gmail.com</span>
      </div>
      <div>
        <FaFacebook className="mx-2" />
        <span>cuca_altohorizonte</span>
      </div>
      <div>
        <FaInstagram className="mx-2" />
        <span>@cuca_altohorizonte</span>
      </div>
      <div>
        <FaMapMarkedAlt className="mx-2" />
        <span> Av. Getulio Vargas, 82 - Centro</span>
      </div>
    </div>
  </div>
);