import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://cuca-api.herokuapp.com'
})

export default instance