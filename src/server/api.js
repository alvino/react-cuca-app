import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()
// 'https://cuca-api.herokuapp.com'
// 'http://localhost:3333'


const instance = axios.create({
  baseURL: process.env.API_CUCA,
});

export default instance