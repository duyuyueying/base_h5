import { Toast } from "vant";
// 复制功能
const h5Copy = {
  methods: {
    h5Copy(content, msg) {
      if (!document.queryCommandSupported('copy')) {
        // 不支持
        return false
      }
      let textarea = document.createElement("textarea")
      textarea.value = content
      textarea.readOnly = "readOnly"
      document.body.appendChild(textarea)
      textarea.select() // 选择对象
      textarea.setSelectionRange(0, content.length) //核心
      document.execCommand("copy") // 执行浏览器复制命令
      textarea.remove()
      Toast(msg ? msg : '复制成功！');
    }
  }
}

// 表单验证
const vertify = {
  methods: {
    // 验证电话号码
    isPhoneNumber(phone) {
      if (!(/^1[3456789]\d{9}$/.test(phone))) {
        return false;
      }
      return true
    },
    // 验证正整数
    isAllNumber(number) {
      if ((/^\d{1,}$/.test(number))) {
        return false;
      }
      return true

    },
    // 验证身份证
    isIdCards(ids) {
      var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (idcardReg.test(ids)) {
        return false;
      }
      return true;
    },
    // 验证英文和数字组合
    isEnAndNumber(str) {
      var reg = /^[a-zA-Z0-9]+$/;
      if (reg.test(str)) {
        return false;
      }
      return true;
    },
    // 验证带小数点的数字
    isFloatNumber(str) {
      var reg = /^([1-9]\d*\.?\d*)|(0\.\d*[1-9])$/;
      if (reg.test(str)) {
        return false;
      }
      return true;
    },
		
  }
}

// 精度计算
const precisionCalc = {
  methods: {
    /**
		 * 乘法函数，用来得到精确的乘法结果
		 * @param {Object} arg1
		 * @param {Object} arg2
		 */
    accMul(arg1, arg2) {
      var m = 0;
      m += this.deal(arg1);
      m += this.deal(arg2);
      var r1 = Number(arg1.toString().replace(".", ""));
      var r2 = Number(arg2.toString().replace(".", ""));
      return (r1 * r2) / Math.pow(10, m)
    },
		/**
		 * 求小数点后的数据长度
		 */
    deal(arg) {
      var t = 0;
      try {
        t = arg.toString().split(".")[1].length
      } catch (e) {
        console.log(e)
      }
      return t;
    }
  }
}

// 初始化智能合约
import { ethers } from "ethers";
const initEth = {
  data() {
    return {
      provider: {},
      signer: {},
      chainId: 0,
      address: '', // 当前钱包的地址
    }
  },
  mixins: [asyncUtils],
  async created() {
    if (typeof ethereum == "undefined") {
      Toast('请安装metamask插件、或者使用qkpay打开')
    } else {
      // const qkiUrk = 'https://hz.node.quarkblockchain.cn ';
      // let customHttpProvider = new ethers.providers.JsonRpcProvider(qkiUrk);
      window.ethereum.enable();
      let customHttpProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      if (window.ethereum.isMetaMask) {
        window.ethereum
          .request({
            method: 'net_version'
          })
          .then((chainId) => {
            //可以把
            if (chainId != "20181205")
              Toast('请使用QKI主网,请切换到QKI主网')
            this.chainId = chainId;
          })
          .catch((error) => {
            // If the request fails, the Promise will reject with an error.
            console.log(error)
          });
      }
      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have a very good reason not to.
        if (chainId != "0x133f0d5") {
          Toast('请使用qki主网')
        }
        setTimeout(function () {
          window.location.reload()
        }, 2500)
      });

      this.provider = customHttpProvider;
      this.signer = customHttpProvider.getSigner();

      await this.getAddress();
    }
  },
  methods: {
    async isQKI() {
      let network = await this.provider.getNetwork();
      let networkVersion = network.chainId;
      if (networkVersion != 20181205) {
        Toast('你当前没有使用QKI主网，请切换主网为QKI');
        return false
      }
      return true;
    },
    // 获取地址
    async getAddress() {
      let [error, address] = await this.to(this.signer.getAddress());
      if(error == null){
        this.address = address;
      } else {
        console.log(error)
      }
    },
    // 查询Transaction,完成后回调
    async queryTransation(hash, fnCallback) {
      await this.provider.waitForTransaction(hash).then(async receipt => {
        Toast("区块打包成功", receipt);
        fnCallback && fnCallback();
      });
    },
    // 部署合约,此方法仅为记录，并不常用
    async deloyConstract(new_abi, bytecode) {
      let factory = new ethers.ContractFactory(new_abi, bytecode, this.signer);
      let [error,data] = await this.to(factory
        .deploy(this.totalAmount, this.name, this.precision, this.shortName, {
          gasLimit: 2000000,
          gasPrice: ethers.utils.parseUnits("1000", "gwei")
        }))
      console.log(error, data);
      this.queryTransation(data.deployTransaction.hash);
    },
    // 十六进制转10进制
    hex2int(hex) {
      if (hex.indexOf("0x") >= 0) {
        hex = hex.substring("2");
      }
      var len = hex.length,
        a = new Array(len),
        code;
      for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48 <= code && code < 58) {
          code -= 48;
        } else {
          code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
      }
      return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
      }, 0);
    },
  }
}

// 下载apk
const downloadApk = {
  methods: {
    downloadApk(params) {
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

      if (u.toLowerCase().match(/MicroMessenger/i) === 'micromessenger') {
        // TODO: 展示跳转浏览器下载
      } else {
        var oA = document.createElement('a')
        oA.download = ''// 设置下载的文件名，默认是'下载'
        oA.href = isAndroid ? params.androidUrl : params.iosUrl
        document.body.appendChild(oA)
        oA.click()
        oA.remove()
      }
    }
  }
}

// 处理异步的工具
const asyncUtils = {
  methods: {
    // 统一封装异步请求
    to(fnPromise){
      return fnPromise.then(res => [null, res]).catch(error => [error]);
    },
     // response公共处理方法
     doResponse(error, res, keyName) {
      console.log(keyName+'================', error, res);
      if (error == null) {
        if (keyName) {
          // 根据实际项目做调整
          let etherString = ethers.utils.formatEther(res);
          this[keyName] = parseFloat(etherString);
        }
        return true;
      } else {
        // 根据实际项目做调整
        if (error.code == "INSUFFICIENT_FUNDS") {
          Toast("矿工费不足");
        } else if (error.code == 4001) {
          Toast("用户取消");
        } else {
          Toast("错误代码:" + error.code);
        }
        return false;
      }
    },
  }
}

// 时间处理工具
const timeUtils = {
  data(){
    return {
      day: '0',
      hour:'00',
      minutes: '00',
      seconds: '00'
    }
  },
  methods: {
     // 获取当前时间
    getCurrTime() {
      let timeStr = (Date.now()).toString().substring(0, 10);
      console.log(timeStr);
    },
    // 时间戳转时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 倒计时
    countDown(maxtime, fnCallback) {
      let distance = maxtime;
      if (maxtime >= 0) {
        // 距离结束剩下多少天
        let day = Math.floor(maxtime / 86400);
        // 得到剩下的分钟数
        maxtime -= day * 86400;
        let hour = Math.floor(maxtime / 3600);
        // 得到剩下的分钟数
        maxtime -= hour * 3600;
        let minutes = Math.floor(maxtime / 60);
        let seconds = Math.floor(maxtime % 60);
        --distance;
        this.day = day.toString();
        if (hour < 10) {
          hour = "0" + hour;
        }
        this.hour = hour.toString();
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        this.minutes = minutes.toString();
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.seconds = seconds.toString();
        this.timer = setTimeout(() => {
          this.countDown(distance, fnCallback);
        }, 1000);
      } else {
        clearInterval(this.timer);
        fnCallback && fnCallback();
      }
    },
  }
}

// 比较两个版本
const compareVersion = {
  methods: {
    // ios比较版本
    compareIosVersion(nowVersion, requestVersion) {
      let reg = /(\d+)\.(\d+)\.(\d+)/;
      let nowArr = [];
      let requestArr = [];
      //参数检查
      try {
        if (nowVersion.match(reg).length !== 4 || requestVersion.match(reg).length !== 4) {
          console.log("Error compareVersion", "param");
          return;
        }
      }
      catch (e) {
        console.log("Error compareVersion", "param");
        return;
      }

      nowArr = nowVersion.match(reg).slice(1, 4);
      requestArr = requestVersion.match(reg).slice(1, 4);

      //console.log(nowArr,requestArr);
      for (let i = 0; i < 3; i++) {
        //console.log(i);
        console.log(nowArr[i], requestArr[i]);
        if (nowArr[i] < requestArr[i]) {
          //console.log("requestVersion is bigger.");
          return false;
        }
        if (nowArr[i] > requestArr[i]) {
          //console.log("requestVersion is bigger.");
          return true;
        }
      }
      return true;
    },
  }
}

// 和原生通信
const channelNative = {
  created() {
    // 挂载到window上
    window.h5ParseJson = this.parseRes;
  },
  
  methods: {
    // eg:使用方式..
    goShare(regCode) {
      const dataStr = JSON.stringify({
        type: 'share',
        funcName: 'h5ParseJson',
        data: JSON.stringify({
          url: 'http://localhost:8081/#/asssit?regCode=' + regCode,
          title: '帮他助力',
          desc: '帮好友冲榜领现金，下载立得1.68元。升级还有红包领。'
        })
      });
      this.toNative(dataStr);
    },
    // 提供给原生调用的h5端的方法
    parseRes(res) {
      console.log(res);
    },
    // 和原生通信
    toNative(dataStr) {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      let res = '';
      // onCall为和原生端定义的方法名，这个属性可变
      if (isAndroid) {
        res = window.postMessage.onCall(dataStr);
      } else {
        res = window.webkit.messageHandlers.onCall.postMessage(dataStr);
      }
      return res;
    },
  }
}

export {
  h5Copy,
  vertify,
  precisionCalc,
  initEth,
  downloadApk,
  asyncUtils,
  timeUtils,
  compareVersion,
  channelNative
}