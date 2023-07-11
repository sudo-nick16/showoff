export type GoogleProfile = {
    id: string;
    _json: {
        sub: string;
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
        locale: string;
    }
}

export type TokenPayload = {
    user_id: number,
    username: string,
    tokenVersion: number
}
