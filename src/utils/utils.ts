import jwt from "jsonwebtoken";
import environment from "../environments";

export function generateAccessToken(data: any) {
    // expires after half and hour (18000 seconds = 300 minutes)
    return jwt.sign(data, environment.ACCESS_TOKEN_SECRET, { expiresIn: '180000s' });
}

export function generateRandomString(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}