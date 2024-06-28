import request from '@/utils/request'

// 查询要塞成绩列表
export function listFortressAchievement(query) {
  return request({
    url: '/naruto/fortressAchievement/list',
    method: 'get',
    params: query
  })
}

// 查询要塞成绩详细
export function getFortressAchievement(id) {
  return request({
    url: '/naruto/fortressAchievement/' + id,
    method: 'get'
  })
}

// 新增要塞成绩
export function addFortressAchievement(data) {
  return request({
    url: '/naruto/fortressAchievement',
    method: 'post',
    data: data
  })
}

// 修改要塞成绩
export function updateFortressAchievement(data) {
  return request({
    url: '/naruto/fortressAchievement',
    method: 'put',
    data: data
  })
}

// 删除要塞成绩
export function delFortressAchievement(id) {
  return request({
    url: '/naruto/fortressAchievement/' + id,
    method: 'delete'
  })
}
