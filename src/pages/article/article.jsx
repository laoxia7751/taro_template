import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { ArticleTemplate } from '@com/article_template'
import { Header } from '@com/header'
import { getArticle, changeCollect, getTipArticle } from '@api'
import { Toast, formatDate, getImageUrl  } from '@utils'
import { connect } from '@tarojs/redux'

import './article.less'
import collectIcon from '@img/icon_collect.png'
import collectedIcon from '@img/icon_collected.png'
import commentIcon from '@img/icon_comment.png'
import shareIcon from '@img/icon_share.png'

@connect(({ global }) => ({
	isLogin: global.isLogin
}))
export default class ArticleDetails extends Component {
	state = {
		article_id: '',
		articleDetail: {},//文章信息
		commentNum: 0,//评论数
		isCollection: false,//是否收藏
		showOpera: true,//展示底部栏
	}

	componentWillMount() {
		if (this.$router.params.type) {
			this.setState({
				showOpera: false
			})
			this.getTips(this.$router.params.type)
		} else {
			this.setState({
				article_id: this.$router.params.id
			})
			this.getArticleInfo(this.$router.params.id)
		}
		
	}
	
	//协议&&政策
	getTips(type){
		getTipArticle(type).then(res=>{
			if (res.code == 200) {
				let articleDetail = {
					post_content: res.data[type]
				}
				this.setState({
					articleDetail 
				})
			} else {
				Toast(res.msg)
			}
		})
	}

	onShareAppMessage(res) {
		return {
			title: this.state.articleDetail.post_title,
			path: '/pages/article/article?id=' + this.state.article_id,
			imageUrl: this.state.articleDetail.more.thumbnail
		}
	}

	//文章详情
	getArticleInfo(id) {
		getArticle(id).then(res => {
			if (res.code == 200) {
				let articleDetail = res.data.detail
				articleDetail.more.thumbnail = getImageUrl(articleDetail.more.thumbnail)
				articleDetail.published_time = formatDate(articleDetail.published_time)
				this.setState({
					commentNum: res.data.commentNum,
					articleDetail, 
					isCollection: res.data.isCollection
				})
			} else {
				Toast(res.msg)
			}
		})
	}
	//修改收藏状态
	changeCollectStatus(status) {
		if (this.props.isLogin) {
			changeCollect(this.state.article_id, status).then(res => {
				if (res.code == 200) {
					Toast(status ? '取消成功':'收藏成功')
					this.getArticleInfo(this.state.article_id)
				} else {
					Toast(res.msg)
				}
			})
		} else {
			Toast('请先登录')
		}
	}

	render() {
		const { articleDetail, isCollection, commentNum, article_id, showOpera } = this.state
		return (
			<View className="index">
				<Header name="center" showBack />
				<View className={`article ${!showOpera ? 'pb0':''}`}>
					<View className="title">{articleDetail.post_title}</View>
					<View className="attrs">{articleDetail.published_time}</View>
					<View className="details">
						{ articleDetail.post_content && <ArticleTemplate data={articleDetail.post_content} />}
					</View>
				</View>
				{
					showOpera && 
					<View className="opera flex jcsb">
						<View className="item" onClick={() => this.changeCollectStatus(isCollection)}>
							<Image src={isCollection ? collectedIcon : collectIcon} mode="aspectFit" className="icon" />
							<View>{isCollection ? '已收藏' : '收藏'}</View>
						</View>
						<View className="item" onClick={() => Taro.navigateTo({ url: '/pages/comment_list/comment_list?id='+article_id })}>
							<Image src={commentIcon} mode="aspectFit" className="icon" />
							<View>评论{ commentNum > 0 ? '('+commentNum+')':''}</View>
						</View>
						<View className="item">
							<Image src={shareIcon} mode="aspectFit" className="icon" />
							<View>分享</View>
							<Button openType="share" className="share_btn">分享</Button>
						</View>
					</View>
				}
			</View>
		)
	}
}