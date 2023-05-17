import * as service from '../../../db/service/AuthService'
import * as mapper from './mapper'


export const create = async (payload) => {
    const user = mapper.toToken(await service.create(payload))
    return user
}