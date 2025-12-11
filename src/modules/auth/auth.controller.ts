import { authServices } from "./auth.service"

const loginUser = async (payload: Record<string, unknown>)=>{
    const {email, password} = payload;
    const result = await authServices.loginUser(email, password)
}