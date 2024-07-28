import request from '@/utils/request'

// 查询晓组织饰品列表
export function listAccessory(query) {
  return request({
    url: '/naruto/accessory/list',
    method: 'get',
    params: query
  })
}

export function getList(query) {
  return request({
    url: '/naruto/accessory/getList',
    method: 'get',
    params: query
  })
}

// 查询晓组织饰品详细
export function getAccessory(id) {
  return request({
    url: '/naruto/accessory/' + id,
    method: 'get'
  })
}

// 新增晓组织饰品
export function addAccessory(data) {
  return request({
    url: '/naruto/accessory',
    method: 'post',
    data: data
  })
}

// 修改晓组织饰品
export function updateAccessory(data) {
  return request({
    url: '/naruto/accessory',
    method: 'put',
    data: data
  })
}

// 删除晓组织饰品
export function delAccessory(id) {
  return request({
    url: '/naruto/accessory/' + id,
    method: 'delete'
  })
}
