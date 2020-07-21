import axios from 'axios';

// 'https://cuca-api.herokuapp.com'
// 'http://localhost:3333'


const instance = axios.create({
    baseURL: 'http://localhost:3333'
})

export default instance