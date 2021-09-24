import { Schema } from 'mongoose'
import { Role } from 'src/role/role.decorator'
import { State } from 'src/user/user.model'

export type PayloadType = {
    login?: string,
    lobby?: Schema.Types.ObjectId,
    sub?: Schema.Types.ObjectId,
    roles?: Role[],
    state?: State,
    iat?: number,
    exp?: number
} 