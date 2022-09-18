import axios from 'axios'

export const api = axios.create({
    baseURL: '/api'
})


//redicionando o usuário para o subscribe