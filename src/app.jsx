import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro' 
import { Provider, connect } from '@tarojs/redux'
import { changeSystemInfo, userLogin } from './redux/actions'
import { login } from '@api'
import 'taro-ui/dist/style/index.scss'
import Index from './pages/index'
import configStore from './redux'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore() 
@connect(({ global }) => ({
  global
}), (dispatch) => ({
  changeSystemInfo (data) {
    dispatch(changeSystemInfo(data))
  },
  userLogin (data) {
    dispatch(userLogin(data))
  },
}))

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/user/user',
    ],
    window: {
      navigationStyle: 'custom',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: 'DIISEA',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      "color": "#999999",
      "selectedColor": "#00b1e4",
      "backgroundColor": "#222222",
      "list": [
        {
          "pagePath": "pages/index/index",
          "text": "更新",
          "iconPath": "static/img/update.png",
          "selectedIconPath": "static/img/update_active.png"
        },
        {
          "pagePath": "pages/user/user",
          "text": "我的",
          "iconPath": "static/img/user.png",
          "selectedIconPath": "static/img/user_active.png"
        }
      ]
    }
  }
  
  componentDidMount () {
    //设置顶部窗口高度信息
    Taro.getSystemInfo({}).then(res  => {
      const titleBarHeight = res.model.indexOf('iPhone') !== -1 ? 44 : 48
      const navBarMarginTop =  res.statusBarHeight || 0
      this.props.changeSystemInfo({ titleBarHeight, navBarMarginTop })
    })

    this.init()
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  init(){
    Taro.showLoading({ title: '' })
    Taro.login().then(res => {
      login( res.code ).then(result => {
        Taro.hideLoading()
        if (result.code == 200) {
          Taro.setStorageSync('token',result.data.token)
          this.props.userLogin(result.data)
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    })
  }
  
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
