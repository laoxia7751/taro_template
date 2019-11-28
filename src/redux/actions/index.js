// export const update_state = (payload) => {
//   return {
//     type: 'UPDATE_STATE',
//     payload
//   }
// }

// 异步的action
export function update_state_async() {
  return dispatch => {
    setTimeout(() => {
      dispatch(update_state())
    }, 2000)
  }
}

//保存系统相关信息
export const changeSystemInfo = (value) => {
  return {
    type: 'CHANGE_SYSTEM_INFO',
    value
  }
}

//用户登录
export const userLogin = (value) => {
  return {
    type: 'LOGIN',
    value
  }
}

//修改用户信息
export const changeUserInfo = (value) => {
  return {
    type: 'CHANGE_USER_INFO',
    value
  }
}