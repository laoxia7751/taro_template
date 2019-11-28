const INITIAL_STATE = {
  num: 0,
  titleBarHeight: 44,          //height height
  navBarMarginTop: 20,         //statusbar height
  isLogin: false,              //login status
  token: '',                   //login token
  user: {},                    //user info
}

export default function global (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CHANGE_SYSTEM_INFO':
      return {
        ...state,
        titleBarHeight: action.value.titleBarHeight,
        navBarMarginTop: action.value.navBarMarginTop
      }
    case 'LOGIN':
      return {
        ...state,
        isLogin: true,
        token: action.value.token,
        user: action.value.user
      }
    case 'LOGOUT':
      return {
        ...state,
        isLogin: false,
        token: '',
        user: {}
      }
    case 'CHANGE_USER_INFO':
      return {
        ...state,
        user: action.value
      }
    default:
      return state
  }
}
