// @flow
// Utility HTTP methods using 'fetch'.

import fetch from 'isomorphic-fetch'
import {
  map, flow, includes, isArray, flatten, toPairs, join,
} from 'lodash/fp'

const expandArrayPairs = ([key: string, value: mixed]) => (
  isArray(value)
    ? value.map(val => [key, val])
    : [[key, value]]
)

const stringify = ([key: string, value: mixed]) => `${key}=${encodeURIComponent(value)}`

export const stringifyParams = (data: { [string]: mixed }) => flow(
  toPairs,
  map(expandArrayPairs),
  flatten,
  map(stringify),
  join('&'),
)(data)

const deserialize = async (response: Response) => {
  const header = response.headers.get('Content-Type')
  return includes('application/json', header)
    ? response.json()
    : response.text()
}

const doRequest = async (url: string, params: RequestOptions) => {
  const response = await fetch(url, params)
  const body = await deserialize(response)
  if (response.status >= 500) {
    // TODO(mark): Better error messages.
    throw new Error('Error on api response')
  }
  if (response.status === 401) {
    throw new Error('401')
  }
  return body
}

const get = (
  baseUrl: string, data: { [string]: mixed }, headers: { [string]: string } = {}
) => {
  const url = data ? `${baseUrl}?${stringifyParams(data)}` : baseUrl
  return doRequest(url, {
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  })
}

const post = (url: string, data: { [string]: mixed }) => doRequest(url, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const MAX_TRIES = 3

const getWithAuthPrompt = async (baseUrl, data, tries = 0) => {
  let response = {}

  try {
    response = await get(baseUrl, data,
      { Authorization: `Basic ${sessionStorage.auth}` }
    )
  } catch (e) {
    if (e.message === '401' && tries < MAX_TRIES) {
      sessionStorage.setItem('auth', btoa(`${prompt('Please enter the password.')}`)); // eslint-disable-line
      return getWithAuthPrompt(baseUrl, data, tries + 1)
    }
    throw e
  }
  return response
}

export const request = {get, post, getWithAuthPrompt}
