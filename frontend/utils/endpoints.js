import { request } from '~/utils/api'

export const userSignIn = metadata =>
  request.post('user/get_or_create', metadata)

export const logUserSession = (userServerId, session) => {
  request.post(`user/${userServerId}/log_session`, {
    session,
  })
}

export const getAllUsers = async () => {
  const res = await request.getWithAuthPrompt('user/all')
  return res.users
}

export const getAllTestSessions = async () => {
  const res = await request.get('testsessions/all')
  return res.testSessions
}
