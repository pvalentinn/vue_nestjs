import { Schema } from 'mongoose'

export type PayloadType = {
    login?: string,
    lobby?: Schema.Types.ObjectId,
    sub?: Schema.Types.ObjectId,
    roles?: string[],
    iat?: number,
    exp?: number
} 