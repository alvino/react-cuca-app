import axios from 'axios';

// 'https://cuca-api.herokuapp.com'
// 'http://localhost:3333'


const instance = axios.create({
  baseURL: "https://cuca-api.herokuapp.com",
});

export default instance