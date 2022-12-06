import Axios, { AxiosInstance } from 'axios';
import {Agent} from "http";

export const axios: AxiosInstance = Axios.create({
  baseURL: 'http://localhost:3001/',
  httpAgent: new Agent({keepAlive: false}) // disable keepAlive until axios is fixed
});
