import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './header.less'
import logo from '@img/logo.png'
import logoWhite from '@img/logo_white.png'
import back from '@img/back.png'
import backWhite from '@img/back_white.png'
@connect(({ global }) => ({
  global
}))

class Navbar extends Component {
  /**
   * 头部组件分为以下种类
   * 只显示一个logo(居中或居左两种情况,根据name参数处理)
   * 左侧一个返回，中间一个logo
   * 左侧返回加标题
  */ 
  render() {
    const { navBarMarginTop, titleBarHeight } = this.props.global
    const { themes='', title='', showBack=true, name="center" } = this.props
    const style = {
      paddingTop: navBarMarginTop + 'px',
      height: titleBarHeight + 'px',
    }
    const headerHeight = parseFloat(navBarMarginTop + titleBarHeight) + 'px'

    return (
      <View className={`header_components ${themes}`}>
        <View className='navbarWrap' style={style}>
          {
            !showBack ?
            <View className={`navbar flex ${name}`}>
              <Image className="logo" src={themes == 'dark' ? logoWhite : logo} mode="aspectFit"/>
            </View>
            : title ?
            <View className="head_left flex ac">
              <View className="back" onClick={()=>Taro.navigateBack({ delta: 1 })}>
                <Image
                  className="icon"
                  src={themes == 'dark' ? backWhite : back} 
                  mode="aspectFit"
                />
              </View>
              <View className="title">{title}</View>
            </View>
            :
            <View className={`navbar flex ${name}`}>
              <View className="back" onClick={()=>Taro.navigateBack({ delta: 1 })}>
                <Image className="icon" src={back} mode="aspectFit"/>
              </View>
              <Image className="logo" src={logo} mode="aspectFit"/>
            </View>
          }
        </View>
        <View className="resize" style={{height: headerHeight}}></View>
      </View>
    );
  }
}
export default Navbar;
