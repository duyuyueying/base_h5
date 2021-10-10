import { http } from './http'
import {covertDetail} from '@/common/request/translate'
const URL = {
  authorize: 'v0/authorize',
  nftDetail: 'v0/goods/item',
}

export const getNftDetail = (params) => http.get(URL.nftDetail, {params}).then(covertDetail)

// 获取authorize
export const postAuthorize = (params) => http.post(URL.authorize, params).then((res)=> {
  const {Data} = res.data;
  if( res.data.Code === 0 ) {
    return {
      error: null,
      data: {
        nickname: Data.Nickname ,
        avatar: Data.Avatar,
        profile: Data.Desc,
        address: Data.UserAddress,
        token: Data.Token
      }
    }
  } else {
    return {
      error: res.data.Msg,
      data: null
    }
  }
});

