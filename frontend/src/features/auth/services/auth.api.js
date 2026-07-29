import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials:true,
});


export async function register({fullname,email,contact,password,isSeller}){
    try{
        const response = await authApi.post("/register",{
            fullname,
            email,
            contact,
            password,
            isSeller
        });

        return response.data;

    }catch(error){
        console.log("Error in register service: ",error);
        throw error;
    }
}