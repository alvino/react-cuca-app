import React from "react";
import { Button } from "react-bootstrap";

export const ButtonHandlePrint = () => (
  <Button onClick={() => window.print()}>Imprimir</Button>
);
