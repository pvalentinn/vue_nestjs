import { Schema } from 'mongoose'

export type PayloadType = {
    login?: string,
    sub?: Schema.Types.ObjectId,
    roles?: string[],
    iat?: number,
    exp?: number
} 