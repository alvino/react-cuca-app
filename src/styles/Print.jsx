import styled from "styled-components";

export default styled.div`
  @media print {
    html,
    button,
    span.order,
    .noprint {
      display: none;
      visibility: hidden;
    }

    .print {
      margin: 0;
      box-shadow: 0;
      visibility: visible;
    }

    @page {
      size: A4;
      margin: 5mm 6mm 2mm 6mm;
      page-break-after: always;
    }
  }
`;
