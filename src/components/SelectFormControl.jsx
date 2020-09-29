import React from "react";
import PropTypes from "prop-types";

export default function SelectFormControl({label, ...props}) {
  return (
    <div className="form-group">
      <label htmlFor={props.id}>{label}</label>
      <select {...props}>{props.children}</select>
    </div>
  );
}

export const OptionDias = () => (
  <>
    <option></option>
    <option>01</option>
    <option>02</option>
    <option>03</option>
    <option>04</option>
    <option>05</option>
    <option>06</option>
    <option>07</option>
    <option>08</option>
    <option>09</option>
    <option>10</option>
    <option>11</option>
    <option>12</option>
    <option>13</option>
    <option>14</option>
    <option>15</option>
    <option>16</option>
    <option>17</option>
    <option>18</option>
    <option>19</option>
    <option>20</option>
    <option>21</option>
    <option>22</option>
    <option>23</option>
    <option>24</option>
    <option>25</option>
    <option>26</option>
    <option>27</option>
    <option>28</option>
    <option>29</option>
    <option>30</option>
    <option>31</option>
  </>
);

export const OptionMeses = () => (
  <>
    <option value="">Selecione um mes</option>
    <option value="01">Janeiro</option>
    <option value="02">Fevereiro</option>
    <option value="03">Março</option>
    <option value="04">Abril</option>
    <option value="05">Maio</option>
    <option value="06">Junho</option>
    <option value="07">Julho</option>
    <option value="08">Agosto</option>
    <option value="09">Setembro</option>
    <option value="10">Outubro</option>
    <option value="11">Novembro</option>
    <option value="12">Dezembro</option>
  </>
);


SelectFormControl.defaultProps = {
  className: "form-control ",
  type: "select",
};

SelectFormControl.propTypes = {
  label: PropTypes.string.isRequired,
};
