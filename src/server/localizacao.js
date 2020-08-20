import axios from 'axios';


const intance = axios.create({
    baseURL: 'https://raw.githubusercontent.com/wgenial/br-cidades-estados-json/master'
})

export default intance