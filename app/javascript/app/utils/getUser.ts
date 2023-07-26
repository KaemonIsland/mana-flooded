import { request } from './request'

export const getUser = async () => {
  const response = await request('/api/v1/user', (error) => {
    console.log('Unable to get user: ', error)
  })

  return { user: response.user }
}
