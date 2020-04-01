import Axios, {AxiosInstance} from "axios";

export const axios: AxiosInstance = Axios.create({
    baseURL: "http://localhost:3001/"
});
