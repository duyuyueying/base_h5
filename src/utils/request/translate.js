export const covertDetail = (res) => {
    if( res.data.Code === 0 ) {
      const data = res.data.Data.Goods;
      const user = res.data.Data.User
      const time = timestampToTime(data.CreatedAt)
      const owner = res.data.Data.Owner
      const priceFormat = res.data.Data.PriceFormat
      const price = calcAmount(priceFormat.Price, priceFormat.Decimals)
      let usdtAmount = Decimal.mul(price, priceFormat.USD || '0').toFixed()
      usdtAmount = calcShowAmount(usdtAmount, 4)
      const detail = {
          id: data.ID,
          createUser: {
            nickname: user.Nickname,
            avatar: user.Avatar,
            address: data.CreateUserAddress,
            profile: '',
            token: '',
            num: ''
          },
          title: data.Name, // 名称
          profile: data.Description, // 简介
          contractAddress: data.ContractAddress,
          coinAmount: price, // qki数量
          usdtAmount: usdtAmount, // usdt数量
          coinSymbol: data.Symbol,
          coinDecimal: priceFormat.Decimals,
          startTime: data.StartTime,
          resUrl: data.Image,
          time: time,
          coinIcon: priceFormat.SymbolIcon,
          networkName: data.Chain.toUpperCase(),
          chainMask: data.TokenId, // tokenid
          num: data.TotalNum, // 数量
          isCollect: false, // 是否收藏
          collectNum: '0', // 收藏数量
          publishPrice: '', // 发布价格
          saleStatus: data.Status+'',
          owner: {
            nickname: owner.Nickname,
            avatar: owner.Avatar,
            address: owner.UserAddress,
            profile: '',
            token: '',
            num: ''
          },
          browser: res.data.Data.Browser
          // ownerAddress: data.
      };
      return {
        error: null,
        data: detail
      }
    } else {
      return {
        error: res.data.Msg,
        data: null
      }
    }
  }