import { setUser,setLoading,setError } from "../state/auth.slice.js";
import { register } from "../services/auth.api.js";
import {useDispatch} from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister({email,password,fullname,contact,isSeller = false}){
            const data = await register({email,contact,fullname,password,isSeller});
            dispatch(setUser(data.user));
    }


    return {handleRegister};
}