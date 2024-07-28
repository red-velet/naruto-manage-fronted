import request from '@/utils/request'

// 查询成员信息列表
export function listMember(query) {
  return request({
    url: '/naruto/member/list',
    method: 'get',
    params: query
  })
}

// 查询成员信息列表
export function listMemberAll() {
  return request({
    url: '/naruto/member/listAll',
    method: 'get',
  })
}

// 查询成员信息详细
export function getMember(id) {
  return request({
    url: '/naruto/member/' + id,
    method: 'get'
  })
}

export function getPowerChart() {
  return request({
    url: '/naruto/member/getPowerChart',
    method: 'get',
  })
}

export function getPowerBetween() {
  return request({
    url: '/naruto/member/getPowerBetween',
    method: 'get',
  })
}

// 新增成员信息
export function addMember(data) {
  return request({
    url: '/naruto/member',
    method: 'post',
    data: data
  })
}

// 修改成员信息
export function updateMember(data) {
  return request({
    url: '/naruto/member',
    method: 'put',
    data: data
  })
}

// 删除成员信息
export function delMember(id) {
  return request({
    url: '/naruto/member/' + id,
    method: 'delete'
  })
}
