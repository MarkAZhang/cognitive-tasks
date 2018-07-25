import { request } from '~/utils/api'

export const userSignIn = metadata =>
  request.post('user/get_or_create', metadata)

export const logSession = session => {
  request.post(`sessions/log`, {
    session,
  })
}

export const getAllUsers = async () => {
  const res = await request.getWithAuthPrompt('user/all')
  return res.users
}

export const getNBackSessions = async () => {
  const res = await request.getWithAuthPrompt('sessions/nback')
  return res.testSessions
}

export const getDigitsSessions = async () => {
  const res = await request.getWithAuthPrompt('sessions/digits')
  return res.testSessions
}

export const getReactionSessions = async () => {
  const res = await request.getWithAuthPrompt('sessions/reaction')
  return res.testSessions
}
