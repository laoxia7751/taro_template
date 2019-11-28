import Taro from "@tarojs/taro";
import { userLogin } from '../redux/actions'
import { login } from '../servers/servers'

/* Toast */
export const Toast = (title='', icon = 'none', duration = 1500, mask = false) => {
  Taro.showToast({
    title,
    icon,
    duration,
    mask
  })
}

/* Loading */
export const ShowLoading = (title = '', mask = false) => {
  Taro.showLoading({
    title,
    mask
  });
} 

/*获取当前页url*/
export const getCurrentPageUrl = () => {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let url = currentPage.route;
  return url;
}

/*返回首页*/
export const pageToLogin = () => {
  Taro.login().then(res => {
    login( res.code ).then(result => {
      if (result.code == 200) {
        Taro.setStorageSync('token',result.data.token)
        userLogin(result.data)
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  })
  // let path = getCurrentPageUrl()
  // if (!path.includes('login')) {
  //   Taro.navigateTo({
  //     url: "/pages/login/login"
  //   });
  // }
}

/* 图片路径补全 */
export const getImageUrl = (url) => {
  if (url == '' || /http|https/g.test(url)) {
    return url
  } else {
    return 'http://dishui.sz3.hostadm.net/upload/' + url
  }
}

/* 时间戳转日期 */
export const formatDate = (d, showHours = false) => {
  const now = new Date(d*1000)
  const year=now.getFullYear(); 
  const month=now.getMonth()+1; 
  const date=now.getDate(); 
  const hour=now.getHours(); 
  const minute=now.getMinutes(); 
  if (showHours) {
    return `${year}-${month}-${date} ${hour}:${minute}`
  } else {
    return year+"-"+month+"-"+date
  }
}

/* 获取当前日期 */
export const getToday = () => {
  let s = Date.parse(new Date())
  return formatDate(s/1000)
}


/* 返回售后状态名称 */
export const getStatusValue = status => {
  //审核状态:-1.驳回0.待审核1.待邮寄（通过）2.收获质检3.维修/换货4.维修/换货（待付款）5.维修/换货（已付款）6.待收货（完成维修）7.待收货（取消维修,等待商家发货）8.处理完成
  switch (status) {
    case -1:
      return '申请已驳回'
    case 0:
      return '申请待审核'
    case 1:
      return '待邮寄'
    case 2:
      return '厂家收货质检'
    case 3:
      return '维修/换货'
    case 4:
      return '维修/换货（待付款）'
    case 5:
      return '维修/换货（已付款）'
    case 6:
      return '待收货（完成维修）'
    case 7:
      return '待收货'
    case 8:
      return '已完成'
    default:
      break;
  }
}

/* 表单验证 */
export const formVerify = (type, formData) => {
  switch (type) {
    case 'regist':
      if (!formData.nickName) {
        Toast('请输入姓名')
      } else if (!formData.birthday) {
        Toast('请选择生日')
      } else if (!formData.phone) {
        Toast('请输入手机号')
      } else if (!(/^1[3456789]\d{9}$/.test(formData.phone))) {
        Toast('手机号格式不正确')
      } else if (!formData.region[0]) {
        Toast('请选择所在地区')
      } else if (!formData.address) {
        Toast('请输入详细地址')
      } else {
        return true
      }
      break;
    case 'afterSales':
      if (!formData.reason) {
        Toast('请选择售后原因')
      } else if (!formData.mode) {
        Toast('请选择售后方式')
      } else if (!formData.detail) {
        Toast('请说明申请售后原因')
      } else if (!formData.image.length) {
        Toast('请上传图片凭证')
      } else {
        return true
      }
    case 'logistics':
      if (!formData.tracking_number) {
        Toast('请输入快递单号')
      } else if (!formData.tracking_company) {
        Toast('请输入快递公司名称')
      } else {
        return true
      }
    default:
      return false
  }
}

