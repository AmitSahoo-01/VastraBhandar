import { setUser,setLoading,setError } from "../state/auth.slice.js";
import { login, register,getMe } from "../services/auth.api.js";
import {useDispatch} from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister({email,password,fullname,contact,isSeller = false}){
            const data = await register({email,contact,fullname,password,isSeller});
            dispatch(setUser(data.user));
            return data.user;
    }

    async function handleLogin({email,password}){
        const data = await login({email,password});
        dispatch(setUser(data.user));
        return data.user;
    }

    async function handleGetMe(){
        try{
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
            dispatch(setError(null));
        }catch(error){
            console.log("Error in getMe hook: ",error);
            dispatch(setError(error));
        }finally{
            dispatch(setLoading(false));
        }
    }

    return {handleRegister,handleLogin,handleGetMe};
}