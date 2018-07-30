import moment from 'moment'

export const getDateString = date => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss ZZ')
}
