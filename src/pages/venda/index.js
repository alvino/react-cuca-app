import React from 'react'
import { Link } from 'react-router-dom'

import logoCuca from '../../assert/logo_cuca.svg'

export default () => {
    return (
        <div className='container-fluid'>
            <div className="row p-3 mb-2 bg-primary text-white d-flex justify-content-between align-items-center sticky-top">
                <div className='d-flex flex-row align-items-center'>
                    <Link to='/' className='text-white'>
                        <img src={logoCuca} height='48px' alt="Logo" />
                    </Link>
                    <h1 style={{ height: '40px', fontSize: '40px' }}>Ponto de Venda</h1>
                </div>
                <div className='mx-3 d-flex flex-column'>
                    <h5 >Itens:</h5>
                    <h3 className='text-right'>8</h3>
                </div>
                <div className='mx-3 d-flex flex-column'>
                    <h5> Valor total dos produtos:</h5>
                    <h3 className='text-right'>2.000,00</h3>
                </div>
            </div>
            <div className="row ">
                <div className="col-4 p-3 mb-2 ">
                    <form>
                        <div className="form-group">
                            <label for="inputProduto">Produto</label>
                            <div className="d-flex">
                                <input type="text" className="form-control form-control-lg" id="inputProduto" />
                                <button className='btn btn-primary py-2 ml-2' >...</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="inputQuantidade">Quantidade</label>
                            <input type='text' className="form-control form-control-lg" id="inputQuantidade" placeholder='1' />

                        </div>
                        <div className="form-group">
                            <label for="inputValor">Valor</label>
                            <input type="text" readOnly className="form-control-plaintext form-control-lg text-right" id="inputValor" value='2.000,00' />

                        </div>
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-primary px-5'>adicionar</button>
                        </div>
                    </form>
                </div>
                <div className="col-8 p-3 mb-2">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Produto (descrição)</th>
                                <th scope="col" className='text-right'>Qt.</th>
                                <th scope="col" className='text-right'>Valor Unit.</th>
                                <th scope="col" className='text-right'>Valor total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row"><button className='btn py-2 btn-danger text-center' >X</button></th>
                                <td>Platificação</td>
                                <td className='text-right'>2</td>
                                <td className='text-right'>10,00</td>
                                <td className='text-right'>20,00</td>
                            </tr>
                            <tr>
                                <th scope="row"><button className='btn py-2 btn-danger text-center' >X</button></th>
                                <td>Platificação</td>
                                <td className='text-right'>2</td>
                                <td className='text-right'>10,00</td>
                                <td className='text-right'>20,00</td>
                            </tr>
                            <tr>
                                <th scope="row"><button className='btn py-2 btn-danger text-center' >X</button></th>
                                <td>Platificação</td>
                                <td className='text-right'>2</td>
                                <td className='text-right'>10,00</td>
                                <td className='text-right'>20,00</td>
                            </tr>
                            <tr>
                                <th scope="row"><button className='btn py-2 btn-danger text-center' >X</button></th>
                                <td>Platificação</td>
                                <td className='text-right'>2</td>
                                <td className='text-right'>10,00</td>
                                <td className='text-right'>20,00</td>
                            </tr>
                            <tr>
                                <th scope="row"><button className='btn py-2 btn-danger text-center' >X</button></th>
                                <td>Platificação</td>
                                <td className='text-right'>2</td>
                                <td className='text-right'>10,00</td>
                                <td className='text-right'>20,00</td>
                            </tr>
                            <tr>
                                <th scope="row"><button className='btn py-2 btn-danger text-center' >X</button></th>
                                <td>Platificação</td>
                                <td className='text-right'>2</td>
                                <td className='text-right'>10,00</td>
                                <td className='text-right'>20,00</td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
