import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Header } from '@com/header'
import { connect } from '@tarojs/redux'
import './index.less' 
import proRegist from '@img/pro_register.png'
import userRegist from '@img/user_regist.png'
import ServiceIcon from '@img/service.png'
import { getIndexInfo } from '../../servers/servers.js'
import { getImageUrl } from '@utils'

@connect(({ global }) => ({
  isLogin: global.isLogin
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    news: []
  }

  componentWillReceiveProps (nextProps) {
    //console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  
  componentDidMount() {
    getIndexInfo().then(res => {
      res.code == 200 && this.setState({ news: res.data.news })
    })
  }
  

  componentDidShow () {

  }

  componentDidHide () { }

  render () {
    let { news } = this.state
    const { isLogin } = this.props
    return (
      <View className='index'>
        <Header themes="light" showBack={false} name="left"/>
        <View className="regist flex jcsb">
          {
            !isLogin &&
            <View className="item flex ac" onClick={()=>Taro.navigateTo({url:'/pages/user_info/user_info?scene=regist'})}>
              <Image src={userRegist} mode="aspectFill" className="w100" />
              <Text>会员注册</Text>
            </View>
          }
          <View className="item flex ac" onClick={()=>Taro.switchTab({url:'/pages/equipment/equipment'})}>
            <Image src={proRegist} mode='aspectFill' className="w100" />
            <Text>产品注册</Text>
          </View>
        </View>
        <View className="index_list">
          {
            news.map(item => 
              <View className="item" onClick={()=>Taro.navigateTo({url: '/pages/article/article?id=' + item.id})} key={item.id}>
                <Image src={getImageUrl(item.more.thumbnail)} mode='widthFix' className="w100" />
                <View className="info">
                  <View className="title">{item.post_title}</View>
                  <View className="disc">{item.post_excerpt}</View>
                </View>
              </View>
            )
          }
        </View>
        <View className="service">
          <View className='wrap'>
            <Image src={ServiceIcon} mode="aspectFill" className="w100" />
            <Button className='btn' openType='contact'>联系客服</Button>
          </View>
        </View>
      </View>
    )
  }
}


