import axios from 'axios'
import qs from 'qs'
import {getLocalstorge} from '@/common/utils'
import { User } from '@/types'
import router from '@/router/index'
import {CURR_ADDRESS} from '@/common/const'

const requestSuccessHandler = (config) => {
  let userInfo
  const address = window.localStorage.getItem(CURR_ADDRESS)
  if(address !== null) {
    userInfo = getLocalstorge(address)
  }
  if(userInfo && config.url.indexOf('ipfs') < 0) {
    const userInforJson = userInfo
    config.headers['X-Token'] = userInforJson.token
  }
  if(config.method == 'post' && config.url.indexOf('ipfs') < 0) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.data = qs.stringify(config.data);
  }
  return config
}

const responseSuccessHandler = (data) => {
  if (data.data.Code === 0) {
    return data
  } else if(data.config.url.indexOf('ipfs') > 0) {
    let json
    if (typeof data.data == 'object') {
      json = [data.data]
    } else {
      const jsonStr = "["+((data.data.trim()).replace(/[\n\r]/g,','))+"]";
      json = JSON.parse(jsonStr);
    }
    return json
  } else if(data.data.Code == -1) {
    // Toast(data.data.Msg)
    router.push('Login')
  } else {
    // Toast(data.data.Msg)
  }
  return Promise.resolve(data)
}
const responseFailHandler = (error) => {
  console.log(error)
  return Promise.reject(error)
}

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
})
http.interceptors.request.use(requestSuccessHandler)
http.interceptors.response.use(responseSuccessHandler, responseFailHandler)

export default axios
