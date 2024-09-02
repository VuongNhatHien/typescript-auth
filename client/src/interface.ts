export interface UserConfig {
    "user_id": number,
    "email": string,
    "username": string,
    "full_name": string,
    "phone": string,
    "day_of_birth": string,
    "decription": string,
    "is_verify": boolean,
    "avatar": string,
    "global_id_active": number,
    "created_at": string,
    "updated_at": string,
}

export interface UserStorageConfig {
    "user": UserConfig,
    "access_token": string
}

export interface ResponseGetUserConfig {
    "data": {
      "user": UserConfig
    },
    "status": number,
    "message": string,
}

export interface ResponseLogoutConfig {
    "data": null,
    "status": number,
    "message": string
}

export interface ResponseRefreshConfig {
    "data": {
        "access_token": string,
    },
    "status": number,
    "message": string,
}