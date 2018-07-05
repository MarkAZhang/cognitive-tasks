import { request } from '~/utils/api'

export const userSignIn = metadata =>
  request.post('user/get_or_create', metadata)

export const logUserSession = (userServerId, session) =>
  request.post(`user/${userServerId}/log_session`, {
    session,
  })
