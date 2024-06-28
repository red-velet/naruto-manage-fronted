import request from '@/utils/request'

// 查询通知邮件管理列表
export function listEmailRecord(query) {
  return request({
    url: '/naruto/emailRecord/list',
    method: 'get',
    params: query
  })
}

// 查询通知邮件管理详细
export function getEmailRecord(id) {
  return request({
    url: '/naruto/emailRecord/' + id,
    method: 'get'
  })
}

// 新增通知邮件管理
export function addEmailRecord(data) {
  return request({
    url: '/naruto/emailRecord',
    method: 'post',
    data: data
  })
}

// 修改通知邮件管理
export function updateEmailRecord(data) {
  return request({
    url: '/naruto/emailRecord',
    method: 'put',
    data: data
  })
}

// 删除通知邮件管理
export function delEmailRecord(id) {
  return request({
    url: '/naruto/emailRecord/' + id,
    method: 'delete'
  })
}
