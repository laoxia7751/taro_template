import Taro , { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import WxParse from '@com/wxParse/wxParse'
import '@com/wxParse/wxParse.wxss'

export default class ArticleTemplate extends Component {
  
  componentWillMount () {
    this.props.data && WxParse.wxParse('article', 'html', this.props.data, this.$scope, 0)
  }

  render() {
    return (
        <View>
          <import src='../wxParse/wxParse.wxml' />
					<template is="wxParse" data="{{wxParseData:article.nodes}}" />
        </View>
    );
  }
}

