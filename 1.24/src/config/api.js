import Axios from '~/utils/requester'
import api from '~/constants/api'

// 服务接口路径补全
const rq = name => `/inmanage/${name}`

export const API = {
  getAuthreSource: rq(api.GET_AUTHRESOURCE),
  getSession: rq(api.GET_SESSION),
  login: rq(api.SET_LOGIN),
  companyList: rq(api.QUERY_COMPANY_LIST),
  addCompanyInfo: rq(api.ADD_COMPANY_INFO),
  delCompanyInfo: rq(api.DELETE_COMPANY_INFO),
  queryModuleList: rq(api.QUERY_MODULE_LIST),
  queryOwnFunctionList: rq(api.QUERY_OWN_FUNCTION_LIST),
  changeFunctionList: rq(api.CHANGE_FUNCTION_LIST),
  queryMessageList: rq(api.QUERY_MESSAGE_LIST),
  submitModuleList: rq(api.SUBMIT_MODULE_LIST),
  getMessageTemplateList: rq(api.GET_MESSAGE_TEMPLATE_LIST),
  addMessageTemplate: rq(api.ADD_MESSAGE_TEMPLATE),
  delMessageTemplate: rq(api.DEL_MESSAGE_TEMPLATE),
  sendNewMessage: rq(api.SEND_NEW_MESSAGE),
  queryInformConfigList: rq(api.QUERY_INFORM_CONFIG_LIST),
  queryTagList: rq(api.QUERY_TAG_LIST),
  uploadCidFile: rq(api.UPLOAD_CID_FILE),
  queryService: rq(api.QUERY_SERVICE),
  queryNebulalistModuleList: rq(api.QUERY_NEBULALIST_MODULE_LIST),
  queryZipList: rq(api.QUERY_ZIP_LIST),
  uploadModuleZipFile: rq(api.UPLOAD_MODULE_ZIP_FILE),
  editService: rq(api.EDIT_SERVICE),
  delService: rq(api.DEL_SERVICE),
  managePackageInfo: rq(api.MANAGE_PACKAGE_INFO),
  submitModifiedInfo: rq(api.SUBMIT_MODIFIED_INFO),
  submitModuleInfo: rq(api.SUBMIT_MODULE_INFO),
  delModule: rq(api.DEL_MODULE),
  deleteZipVersion: rq(api.DELETE_ZIP_VERSION),

  getBranchList: rq(api.GET_BRANCH_LIST),
  getBranchDetail: rq(api.GET_BRANCH_BY_ID),
  // 发布管理
  getUpdateList: rq(api.GET_UPDATE_LIST),
  getUpgradeTask: rq(api.GET_UPGRADE_TASK),
  addUpgradeList: rq(api.ADD_UPGRADE_LIST),
  getVersionDetail: rq(api.GET_VERSION_DETAIL),
  changeVersionTaskStatus: rq(api.SET_UPGRADE_TASK_STATUS),
  getTaskResource: rq(api.GET_RESOURCE),
  addUpgradeTask: rq(api.ADD_UPGRADE_TASK),
  getUpgradeTaskDetail: rq(api.GET_UPGRADE_TASK_DETAIL),
  getAllRole: rq(api.GET_ROLE_LIST_URL),
  getRoleMenuItemRelList: rq(api.GET_ROLE_ALL_ITEM),
  getRoleItem: rq(api.GET_ROLE_ITEM),
  setRoleBindItem: rq(api.SET_ROLE_BIND_ITEM),
  setRoleUpdate: rq(api.SET_ROLE_UPDATE),
  addRole: rq(api.ADD_ROLE),
  delRole: rq(api.DEL_ROLE),
  getPostAllList: rq(api.GET_POST_ALL_LIST),
  addPostList: rq(api.GET_POST_LIST),
  updatePostList: rq(api.SET_POST_QUERY_LIST),
  delPostList: rq(api.DEL_POST_LIST),
  getBsnList: rq(api.GET_BSN_LIST),
  editBranch: rq(api.SET_BRANCH),
  addBsnList: rq(api.ADD_BRANCH),
  delBsnList: rq(api.DEL_BRANCH),
  setCheckOperate: rq(api.SET_CHECK_OPERATE),
  getUserList: rq(api.GET_USER_BY_BRH),
  getCheckHistoryList: rq(api.GET_CHECK_HISTORY_LIST),
  getPenHisList: rq(api.GET_CHECK_STATE_LIST),
  addUser: rq(api.ADD_USER),
  updateUser: rq(api.SET_UPDATE_USER),
  getUserDetail: rq(api.GET_ROLE_BY_USER),
  delUser: rq(api.DEL_USER),
  bindRole: rq(api.SET_USER_BIND_ROLE),
  createUserToRole: rq(api.CONNET_USER_AND_ROLE_URL),
  getCheckList: rq(api.GET_CHECK_LIST),
  getStrategyList: rq(api.GET_STRATEGY_LIST),
  editRel: rq(api.SET_CONNECTION),
  getRelDetail: rq(api.GET_STRATEGY),
  addAuth: rq(api.ADD_STRATEGY),
  // 白名单管理
  qryWhiteList: rq(api.GET_WHITELIST),
  addWhiteList: rq(api.ADD_WHITELIST),
  deleteWhiteList: rq(api.DEL_WHITELIST),
  addWhiteListIds: rq(api.ADD_WHITELIST_INFO),
  qryMappingService: rq(api.QRY_MAPPING_SERVICE),
  getMappingMessageService: rq(api.GET_MAPPING_MESSAGE_SERVICE),
  getMappingTaskListService: rq(api.GET_MAPPING_TASK_LIST_SERVICE),
  createZipMappingTask: rq(api.CREATE_ZIP_MAPPING_TASK),
  qryResourceList: rq(api.GET_RESOURCE),
  // 离线包配置映射表增加
  addMappingService: rq(api.ADD_MAPPING_SERVICE),
  delMapping: rq(api.DEL_MAPPING),
  // 热修复管理
  changeTaskStatus: rq(api.SET_PAUSE_HOTPATCH_TASK), // IM10015
  createHotpatchResource: rq(api.ADD_HOTPATCH_LIST), // IM10016
  getHotpatchResourceList: rq(api.GET_HOTPATCH_LIST), // IM10017
  createHotpatchTask: rq(api.ADD_HOTPATCH_TASK), // IM10018
  getHotpatchTaskListByPackageId: rq(api.GET_QUERY_HOTPATCH_LIST), // IM10019
  // 资源管理
  getRouList: rq(api.GET_RESOURCE),
  addRes: rq(api.ADD_RESOURCE),
  updateAuthSer: rq(api.SET_STRATEGY),
  delAuth: rq(api.DEL_STRATEGY),
  delResList: rq(api.DEL_RESOURCE),
  updateResList: rq(api.SET_RESOURCE),
  channel: '/mock/channel.json',
  assets: '/mock/assets.json',
  home: '/mock/home.json',
  address: '/mock/address.json'
}

// 陈梦翔负责代码区域
// 获取登录所需的参数
export const getSession = () => Axios({
  method: 'post',
  url: API.getSession
})
// 登录接口
export const getLogin = data => Axios({
  method: 'post',
  url: API.login,
  data: data
})
// 获取首页信息
export const getAuthreSource = () => Axios({
  method: 'post',
  url: API.getAuthreSource
})
// 获取公司列表信息
export const queryCompanyList = data => Axios({
  method: 'post',
  url: API.companyList,
  data: data
})
// 添加公司信息
export const addCompanyInfo = data => Axios({
  method: 'post',
  url: API.addCompanyInfo,
  data: data
})
// 删除公司信息
export const delCompanyInfo = data => Axios({
  method: 'post',
  url: API.delCompanyInfo,
  data: data
})
// 查询模块信息
export const queryModuleList = data => Axios({
  method: 'post',
  url: API.queryModuleList,
  data: data
})
// 查询模块对应的功能
export const queryOwnFunctionList = data => Axios({
  method: 'post',
  url: API.queryOwnFunctionList,
  data: data
})
// 修改模块
export const submitModuleList = data => Axios({
  method: 'post',
  url: API.submitModuleList,
  data: data
})
// 修改功能
export const changeFunctionList = data => Axios({
  method: 'post',
  url: API.changeFunctionList,
  data: data
})
// 获取消息列表
export const queryMessageList = data => Axios({
  method: 'post',
  url: API.queryMessageList,
  data: data
})
// 获取消息模板列表
export const getMessageTemplateList = () => Axios({
  method: 'post',
  url: API.getMessageTemplateList
})
// 添加消息模板
export const addMessageTemplate = data => Axios({
  method: 'post',
  url: API.addMessageTemplate,
  data: data
})
// 删除消息模板
export const delMessageTemplate = data => Axios({
  method: 'post',
  url: API.delMessageTemplate,
  data: data
})
// 发送消息
export const sendNewMessage = data => Axios({
  method: 'post',
  url: API.sendNewMessage,
  data: data,
  type: 'J'
})
// 获取消息模板
export const queryInformConfigList = data => Axios({
  method: 'post',
  url: API.queryInformConfigList,
  data: data
})
// 获取标签列表
export const queryTagList = data => Axios({
  method: 'post',
  url: API.queryTagList,
  data: data
})
// 上传文件
export const uploadCidFile = data => Axios({
  method: 'post',
  url: API.uploadCidFile,
  data: data
})
// 查询服务
export const queryService = () => Axios({
  method: 'post',
  url: API.queryService
})
// 查询服务下的包
export const queryNebulalistModuleList = data => Axios({
  method: 'post',
  url: API.queryNebulalistModuleList,
  data: data
})
// 查询包的详情
export const queryZipList = data => Axios({
  method: 'post',
  url: API.queryZipList,
  data: data
})
// 修改/增加服务
export const editService = data => Axios({
  method: 'post',
  url: API.editService,
  data: data
})
// 删除服务
export const delService = data => Axios({
  method: 'post',
  url: API.delService,
  data: data
})
// 打包/重新打包接口
export const managePackageInfo = data => Axios({
  method: 'post',
  url: API.managePackageInfo,
  data: data
})
// 修改包信息
export const submitModifiedInfo = data => Axios({
  method: 'post',
  url: API.submitModifiedInfo,
  data: data
})
// 服务下增加/修改包信息
export const submitModuleInfo = data => Axios({
  method: 'post',
  url: API.submitModuleInfo,
  data: data
})
// 删除服务下包的信息
export const delModule = data => Axios({
  method: 'post',
  url: API.delModule,
  data: data
})
// 删除离线包
export const deleteZipVersion = data => Axios({
  method: 'post',
  url: API.deleteZipVersion,
  data: data
})

// 曹琴负责代码区域
  // 发布管理
export const getUpdateList = (data) => Axios({
  method: 'post',
  url: API.getUpdateList,
  data: data
})
  // 发布包列表
export const getUpgradeTask = (data) => Axios({
  method: 'post',
  url: API.getUpgradeTask,
  data: data
})
  // 增加发布包
export const addUpgradeList = (data) => Axios({
  method: 'post',
  url: API.addUpgradeList,
  data: data
})
  // 获取版本更新状态信息
export const getVersionDetail = (data) => Axios({
  method: 'post',
  url: API.getVersionDetail,
  data: data
})
  // 修改发布包状态
export const changeVersionTaskStatus = (data) => Axios({
  method: 'post',
  url: API.changeVersionTaskStatus,
  data: data
})
// 资源列表查询
export const getTaskResource = (data) => Axios({
  method: 'post',
  url: API.getTaskResource,
  data: data
})
// 创建发布任务
export const addUpgradeTask = (data) => Axios({
  method: 'post',
  url: API.addUpgradeTask,
  data: data
})
// 任务详情
export const getUpgradeTaskDetail = (data) => Axios({
  method: 'post',
  url: API.getUpgradeTaskDetail,
  data: data
})
  // 角色模块
    // 获取所有角色
export const getAllRole = () => Axios({
  method: 'get',
  url: API.getAllRole
})
    // 角色详情
export const getRoleItem = data => Axios({
  method: 'post',
  url: API.getRoleItem,
  data: data
})
    // 查询角色与菜单功能关联
export const getRoleMenuItemRelList = data => Axios({
  method: 'post',
  url: API.getRoleMenuItemRelList,
  data: data
})
    // 设置角色绑定功能
export const setRoleBindItem = data => Axios({
  method: 'post',
  url: API.setRoleBindItem,
  data:data
})
    // 更新角色信息
export const setRoleUpdate = data => Axios({
  method: 'post',
  url: API.setRoleUpdate,
  data: data
})
    // 增加角色
export const addRole = data => Axios({
  method: 'post',
  url: API.addRole,
  data: data
})
    // 删除角色
export const delRole = data => Axios({
  method: 'post',
  url: API.delRole,
  data: data
})
  // 岗位模块
    // 获取所有岗位
export const getPostAllList = data => Axios({
  method: 'post',
  url: API.getPostAllList,
  data: data
})
    // 新增岗位
export const addPostList = data => Axios({
  method: 'post',
  url: API.addPostList,
  data: data
})
    //修改岗位
export const updatePostList = data => Axios({
  method: 'post',
  url: API.updatePostList,
  data: data
})
    //删除岗位
export const delPostList = data => Axios({
  method: 'post',
  url: API.delPostList,
  data: data
})
  // 审查管理
    // 审查列表
export const getCheckList = data => Axios({
  method: 'post',
  url: API.getCheckList,
  data: data
})
    // 审查同意or驳回
export const setCheckOperate = data => Axios({
  method: 'post',
  url: API.setCheckOperate,
  data: data
})
    // 审查历史
export const getCheckHistoryList = data => Axios({
  method: 'post',
  url: API.getCheckHistoryList,
  data: data
})
    // 审查记录
export const getPenHisList = data => Axios({
  method: 'post',
  url: API.getPenHisList,
  data: data
})

// 朱栋豪负责代码区域
  //机构管理模块列表树
export const getBranchList = data => Axios({
  method: 'get',
  url:API.getBranchList,
  data: data
})
  //保存修改机构
export const editBranch = data => Axios({
  method: 'post',
  url:API.editBranch,
  data: data
})
  //增加机构管理
export const addBsnList = data => Axios({
  method: 'post',
  url: API.addBsnList,
  data: data
})
export const updateUser = data => Axios({
  method: 'post',
  url: API.updateUser,
  data: data
})
  //删除机构
export const delBsnList = data => Axios({
  method: 'post',
  url: API.delBsnList,
  data: data
})
  //机构管理模块详情
export const getBranchDetail = data => Axios({
  method: 'post',
  url:API.getBranchDetail,
  data: data
})
  //用户列表
export const getUserList = data => Axios({
  method: 'post',
  url: API.getUserList,
  data: data
})
  //获取用户详情列表
export const getUserDetail = data => Axios({
  method: 'post',
  url: API.getUserDetail,
  data: data
})
export const addUser = data => Axios({
  method: 'post',
  url: API.addUser,
  data: data
})
  //删除用户列表
export const delUser = data => Axios({
  method: 'post',
  url: API.delUser,
  data: data
})
  // 用户角色绑定
export const bindRole = data => Axios({
  method: 'post',
  url: API.bindRole,
  data: data
})
  //用户列表关联
export const createUserToRole = data => Axios({
  method: 'post',
  url: API.createUserToRole,
  data: data
})
  //审查设置列表
export const getBsnList = data => Axios({
  method: 'post',
  url:API.getBsnList,
  data: data
})
  //策略设置
export const getStrategyList = data => Axios({
  method: 'post',
  url:API.getStrategyList,
  data: data
})
  // 设置关联
export const editRel = data => Axios({
  method: 'post',
  url: API.editRel,
  data: data
})
  // 权限详情
export const getRelDetail = data => Axios({
  method: 'post',
  url: API.getRelDetail,
  data: data
})
  // 增加策略
export const addAuth = data => Axios({
  method: 'post',
  url: API.addAuth,
  data: data
})
 // 修改策略
export const updateAuthSer = data => Axios({
  method: 'post',
  url: API.updateAuthSer,
  data: data
})
 // 删除策略
export const delAuth = data => Axios({
  method: 'post',
  url: API.delAuth,
  data: data
})
export const getRouList = data => Axios({ //获取资源配置列表
  method: 'post',
  url: API.getRouList,
  data: data
})
export const addRes = data => Axios({ //增加资源配置列表
  method: 'post',
  url: API.addRes,
  data: data
})
export const updateResList = data => Axios({ //修改资源配置列表
  method: 'post',
  url: API.updateResList,
  data: data
})
export const delResList = data => Axios({ //删除资源配置列表
  method: 'post',
  url: API.delResList,
  data: data
})
// 接口演示无用区域
export const getHome = data => {
  return Axios({
    method: 'get',
    url: API.home
  })
}

export const getLessons = data => {
  return Axios({
    method: 'get',
    url: API.channel
  })
}

export const getAssets = data => {
  return Axios({
    method: 'get',
    url: API.assets
  })
}

export const getAddress = data => {
  return Axios({
    method: 'get',
    url: API.address
  })
}

// 赵榆负责代码区域
// 离线包管理中的配置部分
export const qryMappingService = data => {
  return Axios({
    method: 'post',
    url: API.qryMappingService,
    data: data
  })
}
// 离线包管理中配置部分的详情接口
export const getMappingMessageService = data => {
  return Axios({
    method: 'post',
    url: API.getMappingMessageService,
    data: data
  })
}
// 离线包管理配置部分手风琴展开页面接口
export const getMappingTaskListService = data => {
  return Axios({
    method: 'post',
    url: API.getMappingTaskListService,
    data: data
  })
}
// 离线包配置页面创建发布调用接口
export const createZipMappingTask = data => {
  return Axios({
    method: 'post',
    url: API.createZipMappingTask,
    data: data
  })
}
// 资源列表查询
export const qryResourceList = data => {
  return Axios({
    method: 'post',
    url: API.qryResourceList,
    data: data
  })
}
// 离线包配置映射表增加
export const addMappingService = data => {
  return Axios({
    method: 'post',
    url: API.addMappingService,
    data: data
  })
}
// 配置项删除
export const delMapping = data => {
  return Axios({
    method: 'post',
    url: API.delMapping,
    data: data
  })
}

// 於南峰
// 白名单列表查询
export const qryWhiteList = () => {
  return Axios({
    method: 'get',
    url: API.qryWhiteList
  })
}
// 添加白名单
export const addWhiteList = data => {
  return Axios({
    method: 'post',
    url: API.addWhiteList,
    data: data
  })
}
// 新增白名单
export const addWhiteListIds = data => {
  return Axios({
    method: 'post',
    url: API.addWhiteListIds,
    data: data
  })
}
// 删除白名单
export const deleteWhiteList = data => {
  return Axios({
    method: 'post',
    url: API.deleteWhiteList,
    data: data
  })
}
// 获取热修复列表
export const getHotpatchResourceList = data => {
  return Axios({
    method: 'post',
    url: API.getHotpatchResourceList,
    data: data
  })
}
// 添加热修复
export const createHotpatchResource = data => {
  return Axios({
    method: 'post',
    url: API.createHotpatchResource,
    data: data
  })
}
// 创建热修复任务
export const createHotpatchTask = data => {
  return Axios({
    method: 'post',
    url: API.createHotpatchTask,
    data: data
  })
}
// 任务列表查询
export const getHotpatchTaskListByPackageId = data => {
  return Axios({
    method: 'post',
    url: API.getHotpatchTaskListByPackageId,
    data: data
  })
}
// 状态修改
export const changeTaskStatus = data => {
  return Axios({
    method: 'post',
    url: API.changeTaskStatus,
    data: data
  })
}
