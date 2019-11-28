import Taro from '@tarojs/taro'
import getBaseUrl from './baseUrl'

//单文件上传
export const uploadFile = (file, type='') => {
  let urlInfo = type == 'video' ? '/api/user/uploadVideo' : '/api/user/avatarUpload'
  return Taro.uploadFile({
    url: getBaseUrl(urlInfo) + urlInfo,
    header: {
      'xxDeviceType': 'mobile',
      'xxToken': Taro.getStorageSync('token') || ''
    },
    filePath: file,
    name: 'file',
    formData: {}
  })
}

//多文件上传
export const uploadFiles = (files) => {
  return Promise.all(files.map(url => {
    return new Promise(function (resolve, reject) {
      Taro.uploadFile({
        url: getBaseUrl('/api/user/avatarUpload') + '/api/user/avatarUpload',
        header: {
          'xxDeviceType': 'mobile',
          'xxToken': Taro.getStorageSync('token') || ''
        },
        filePath: url,
        name: 'file',
        success: res => {
          if (res.statusCode == 200) {
            resolve(JSON.parse(res.data).data.url)
          } else {
            reject(res)
          }
        },
        fail: fail => {
          reject(fail)
        }
      })
    })
  }))
}