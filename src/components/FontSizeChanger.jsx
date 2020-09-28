import React, {useState, useEffect} from "react";

// import { Container } from './styles';

function FontSizeChanger() {
  const KEY_FONTSIZE = 'REACT_HTML_FONT-SIZE'
  const pass = 2
  const MAX = 20
  const MIN = 10

  const [fontsize, setFontsize] = useState(12);

  useEffect( () => {
    const storageFontSize = localStorage.getItem(KEY_FONTSIZE);
    if(storageFontSize) {
      setFontsize(Number(storageFontSize))
    }
  }, [])

  useEffect( () => {
    localStorage.setItem(KEY_FONTSIZE, fontsize)
    document.getElementById("myHtml").style.fontSize = fontsize+"px"
  }, [fontsize])

  const up = () => {
    if(fontsize >= MAX) return 
    setFontsize( fontsize + pass)
  }

  const down = () => {
     if(fontsize <= MIN) return 
    setFontsize( fontsize - pass)
  }



  return (
    <>
      <div class="btn-group mx-2" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-light" onClick={up}>
          A+
        </button>
        <button type="button" class="btn btn-outline-light" onClick={down}>
          A-
        </button>
      </div>
    </>
  );
}

export default FontSizeChanger;
