import React from "react";
import {
  FaUser,
  FaTruck,
  FaWarehouse,
  FaShoppingCart,
  FaClipboardList,
  FaDollarSign,
  FaPlus,
  FaMinus,
} from 'react-icons/fa'

// import NavBar from '../components/NavBar'
import Header from '../components/Header'
import Box from '../components/Box'

export default () => {

  return (
    <div className='mb-5'>
      <Header />

      <div className='container-fluid'>
        <main className='d-flex sm:flex-column  align-items-center'>

          <div className='row w-75 mx-auto'>

            <Box title='Ponto de Venda' to='/venda' >
              <FaShoppingCart size='110px' />
            </Box>

            <Box title='Orçamentos' to='/orcamento' >
              <FaClipboardList size='110px' />
            </Box>

            <Box title='Estoque' to='/estoque' >
              <FaWarehouse size='110px' />
            </Box>

            <Box title='Clientes' to='/cliente' >
              <FaUser size='110px' />
            </Box>

            <Box title='Fornecedores' to='/fornecedor' >
              <FaTruck size='110px' />
            </Box>

            <Box title='Entrada' to='/entrada' >
              <FaDollarSign size='110px' />
              <FaPlus size='40px' />
            </Box>

            <Box title='Saida' to='/entrada' >
              <FaDollarSign size='110px' />
              <FaMinus size='40px' />
            </Box>




          </div>

        </main>
      </div>
    </div>

  )
}
