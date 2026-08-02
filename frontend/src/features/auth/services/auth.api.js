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


export async function login({email,password}) {
    try{
        const response = await authApi.post("/login",{
            email,
            password
        });

        return response.data;
    }catch(error){
        console.log("Error in login service: ",error);
        throw error;
    }
}

export async function getMe() {
    try{
        const response = await authApi.get("/getMe");
        return response.data;
    }catch(error){
        console.log("Error in getMe service: ",error);
        throw error;
    }
    
}