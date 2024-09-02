import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { UserStorageConfig, ResponseRefreshConfig } from "../interface"

const renewToken = async (access_token: string, userStorage: UserStorageConfig) => {
  try {
    const decode = jwtDecode(access_token)
    if (!decode.exp) {
      console.log("No exp")
      return ""
    }

    if (Date.now() >= decode.exp * 1000) {
      const res = await axios.post<ResponseRefreshConfig>(
        "http://localhost:8080/api/auth/refresh",
        {},
        { withCredentials: true }
        );
      console.log(res.data.message)

      access_token = res.data.data.access_token;
      localStorage.setItem("user", JSON.stringify({
        user: userStorage.user,
        access_token: access_token,
        }))

      }
    return access_token
  } catch (err) {
    console.log(err)
    return ""
  }

}
export default renewToken