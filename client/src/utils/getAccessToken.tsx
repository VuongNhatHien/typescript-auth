import getUserStorage from "./getUserStorage"
import renewToken from "./renewToken"
import { UserStorageConfig } from "../interface"

const getAccessToken = async () => {
    const userStorage: UserStorageConfig = getUserStorage()
    var access_token = userStorage.access_token

    //if access token expired, request a new one, if not then return the old access token
    access_token = await renewToken(access_token, userStorage)
    return access_token
}

export default getAccessToken
