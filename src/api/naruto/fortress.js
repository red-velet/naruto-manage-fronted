import request from '@/utils/request'

// 查询要塞信息列表
export function listFortress(query) {
  return request({
    url: '/naruto/fortress/list',
    method: 'get',
    params: query
  })
}

// 查询要塞信息详细
export function getFortress(id) {
  return request({
    url: '/naruto/fortress/' + id,
    method: 'get'
  })
}

// 新增要塞信息
export function addFortress(data) {
  return request({
    url: '/naruto/fortress',
    method: 'post',
    data: data
  })
}

// 修改要塞信息
export function updateFortress(data) {
  return request({
    url: '/naruto/fortress',
    method: 'put',
    data: data
  })
}

// 删除要塞信息
export function delFortress(id) {
  return request({
    url: '/naruto/fortress/' + id,
    method: 'delete'
  })
}
