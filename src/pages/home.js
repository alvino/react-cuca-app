import React from "react";

// import NavBar from '../components/NavBar'
import Header from '../components/Header'
import Box from '../components/Box'

export default () => {


  return (
    <div>
      <Header />

      <div className='container-fluid'>
        <main className='d-flex'>
          <Box title='Cliente' to='/cliente' />
          <Box title='Fornecedor' to='/fornecedor' />
          <Box title='Ponto de Venda' to='/pdv' />
        </main>
      </div>
    </div>

  )
}
