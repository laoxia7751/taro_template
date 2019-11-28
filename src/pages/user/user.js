import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Header } from '@com/header'
import { AtAvatar, AtAccordion, AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { Toast, ShowLoading, getImageUrl } from '@utils'
import { getUserInfo, getArticleCategory, upload, changeUserAvatar } from '@api'
import { changeUserInfo } from '../../redux/actions'
import EditIcon from '@img/edit.png'
import setupIcon from '@img/icon_setup.png'
import serviceIcon from '@img/icon_service.png'
import orderIcon from '@img/icon_order.png'
import productIcon from '@img/icon_product.png'

import './user.less';

@connect(({ global }) => ({
  isLogin: global.isLogin,
  user: global.user,
}), (dispatch) => ({
  changeUserInfo (data) {
    dispatch(changeUserInfo(data))
  },
}))

export default class User extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      open: false,
      articleCategory: [],//内容分类
    } 
  }
  config = {
    navigationBarTitleText: '我的',
    navigationBarBackgroundColor: '#222222',
    navigationBarTextStyle: 'white',
    disableScroll: true
  }

  componentWillMount() {
    this.getArticleList()
    
  }

  componentDidShow() {
    this.getUser()
  }

  //获取文章列表
  getArticleList() {
    getArticleCategory().then(res => {
      if (res.code == 200) {
        let articleCategory = res.data.menuList.map(item => {
          item.open = false
          return item
        })
        this.setState({ articleCategory })
      } else {
        Toast(res.msg)
      }
    })
  }

  //获取用户信息
  getUser() {
    if (this.props.isLogin) {
      //请求用户信息
      getUserInfo().then(res => {
        if (res.code == 200) {
          let user = res.data.user
          user.avatar = getImageUrl(user.avatar)
          this.props.changeUserInfo(user)
        } else {
          Toast(res.msg)
        }
      })
    } else {
      Toast('请先登录')
      Taro.switchTab({
        url:'/pages/index/index'
      })
    }
  }

  //上传图片
  uploadAvatar() {
    Taro.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera']
    }).then(res => {
      ShowLoading('',true)
      upload(res.tempFilePaths[0]).then(result => {
        let data = JSON.parse(result.data)
        data.code == 200 ? this.changeAvatar(data.data.url):Toast(data.msg)
      })
    })
  }

  //修改用户头像
  changeAvatar(avatar){
    changeUserAvatar(avatar).then(res => {
      Toast(res.msg)
      res.code == 200 && this.getUser()
    })
  }

  //手风琴切换事件
  handleAccordionChange = id => {
    let articleCategory = this.state.articleCategory.map(item => {
      item.open = item.id == id
      return item
    })
    this.setState({ articleCategory })
  }

  //跳转 1=>详情 2=>外链 3=>外部小程序
  skip = (type, id, link="") => {
    switch (type) {
      case 1:
        Taro.navigateTo({
          url: `/pages/article_list/article_list?id=${id}&title=${link}`
        })
        break;
      case 2:
        Taro.navigateTo({
          url: '/pages/out_link/out_link?url='+link
        })
        break;
      default:
        Taro.navigateToMiniProgram({
          appId: link
        })
        break;
    }
  }

  render () {
    let { articleCategory } = this.state
    const { user } = this.props
    return (
      <View className='user'>
        <Header themes="dark" name="left" showBack={false}/>
        <View className="index_top dark">
          <Text>欢迎您，{user.user_nickname}</Text>
          <Image src={EditIcon} mode="aspectFit" className="icon" onClick={() => Taro.navigateTo({url:'/pages/user_info/user_info?scene=edit'})} />
        </View>
        <View className="user_top">
          <View className="user_info flex ac">
            <View onClick={this.uploadAvatar.bind(this)}>
              <AtAvatar size="large" circle image={user.avatar}></AtAvatar>
            </View>
            <View className="flex direction jc">
              <Text className="fwb">{user.user_nickname}</Text>
              <Text className="phone">{user.mobile}</Text>
            </View>
            <View className="setup" onClick={() => Taro.navigateTo({url:'/pages/user_info/user_info?scene=edit'})}>
              <Image src={setupIcon} mode="aspectFit" className="icon" />
            </View>
          </View>
          <View className="user_menu flex tac jcsb">
            <View className="item" onClick={() => Taro.navigateTo({url:'/pages/my_service/my_service'})}>
              <Image src={serviceIcon} mode="aspectFit" className="icon" />
              <Text className="name">我的售后</Text>
            </View>
            <View className="item" onClick={this.toMall.bind(this)}>
              <Image src={orderIcon} mode="aspectFit" className="icon" />
              <Text className="name">我的订购</Text>
            </View>
            <View className="item" onClick={() => Taro.switchTab({url:'/pages/equipment/equipment'}) }>
              <Image src={productIcon} mode="aspectFit" className="icon" />
              <Text className="name">我的产品</Text>
            </View>
          </View>
        </View>

        <View className="menu_list">
          {
            articleCategory.map(item => 
              item.children.length ? 
              <AtAccordion open={item.open} key={item.id} className={item.open ? 'show':''} onClick={()=>this.handleAccordionChange(item.id)} title={item.name}>
                <AtList hasBorder={false}>
                  {item.children.map(it => 
                    <AtListItem title={it.name} onClick={() => this.skip(it.type, it.id, it.name)} key={it.id}/>
                  )}
                </AtList>
              </AtAccordion>
              :
              <AtAccordion key={item.id} onClick={() => this.skip(item.type, item.id, item.name)} className="alone" title={item.name}></AtAccordion>
            )
          }
        </View>
      </View>
    )
  }
}

