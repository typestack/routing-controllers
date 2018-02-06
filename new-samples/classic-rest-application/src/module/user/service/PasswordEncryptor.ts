import {Service} from "typedi";

@Service()
export class PasswordEncryptor {

    encrypt(password: string) {
        return password + "%^&";
    }

}