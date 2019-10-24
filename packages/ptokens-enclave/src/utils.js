import axios from 'axios'

const api = axios.create({
  baseURL: 'https://repsi.serveo.net',
  timeout: 50000,
  headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',  
      'Content-Type': 'application/json',
  }
})

export {
  api
}