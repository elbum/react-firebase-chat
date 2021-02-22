import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
import {
    SET_USER 
} from './types';

export function setUser(user){
    return {
        type: SET_USER ,
        payload: user
    }
}