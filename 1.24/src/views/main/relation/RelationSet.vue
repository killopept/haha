<template>
  <div class="pagePolicySettings">
    <div style="padding:20px 30px; text-align: right;">
      <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addAuth=true">新增策略</el-button>
      <el-dialog title="增加策略" :visible.sync="addAuth" style="text-align:left">
        <el-form :model="addAuthService" label-width="100px" ref="addAuthService">
          <el-row>
            <el-col :span="18" :offset="3">
              <el-form-item label="策略名称:" prop="alias" :rules="{ required: true,message: '请填写策略名称'}">
                <el-input size="small" placeholder="请填写策略名称" v-model="addAuthService.alias"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" :offset="3">
              <el-form-item label="授权方式:" prop="authType" :rules="[{ required: false}]">
                <el-radio-group v-model="addAuthService.authType">
                  <el-radio label="0">无序</el-radio>
                  <el-radio label="1">有序</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="3">
              <el-form-item label="一级授权人数:" :rules="{ required: false}">
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-slider
                v-model="addAuthService.ad1"
                :step="1"
                :max="9"
                show-stops>
              </el-slider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="3">
              <el-form-item label="二级授权人数:" :rules="{ required: false}">
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-slider
                v-model="addAuthService.ad2"
                :step="1"
                :max="9"
                show-stops>
              </el-slider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="3">
              <el-form-item label="三级授权人数:" :rules="{ required: false}">
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-slider
                v-model="addAuthService.ad3"
                :step="1"
                :max="9"
                show-stops>
              </el-slider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="3">
              <el-form-item label="四级授权人数:" :rules="{ required: false}">
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-slider
                v-model="addAuthService.ad4"
                :step="1"
                :max="9"
                show-stops>
              </el-slider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="3">
              <el-form-item label="五级授权人数:" :rules="{ required: false}">
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-slider
                v-model="addAuthService.ad5"
                :step="1"
                :max="9"
                show-stops>
              </el-slider>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addAuth = false" size="small">返回</el-button>
          <el-button type="primary" @click="subAdd('addAuthService')" size="small">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="app-narrow-table" style="padding: 0px 30px;">
      <el-table
        v-loading = "relationSetLoading"
        :data="getAuthDefListService"
        style="width: 100%;border-radius:5px"
        border>
        <el-table-column
          prop="authId"
          label="策略编号">
        </el-table-column>
        <el-table-column
          prop="alias"
          label="策略名称">
        </el-table-column>
        <el-table-column
          prop="authType"
          label="授权方式">
        </el-table-column>
        <el-table-column
          prop="authDefine"
          label="授权定义"
          align="center"
          >
          <el-table-column
            prop="grade1"
            label="一级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="grade2"
            label="二级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="grade3"
            label="三级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="grade4"
            label="四级"
            width="120">
          </el-table-column>
          <el-table-column
            prop="grade5"
            label="五级"
            width="120"
            >
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="control"
          label="	操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="update(scope.row)">
              修改
            </el-button>
            <el-dialog title="修改策略" :visible.sync="updateAuth" style="text-align:left">
              <el-form :model="updateAuthService" label-width="100px" ref="updateAuthService">
                <el-row>
                  <el-col :span="18" :offset="3">
                    <el-form-item label="策略编号:" prop="authId" :rules="{ required: false}">
                      <span>{{updateAuthService.authId}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" :offset="3">
                    <el-form-item label="策略名称:" prop="alias" :rules="{ required: true,message: '请填写策略名称'}">
                      <el-input size="small" placeholder="请填写策略名称" v-model="updateAuthService.alias"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" :offset="3">
                    <el-form-item label="授权方式:" prop="authType" :rules="[{ required: false}]">
                      <el-radio-group v-model="updateAuthService.authType">
                        <el-radio label="0">无序</el-radio>
                        <el-radio label="1">有序</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="3">
                    <el-form-item label="一级授权人数:" :rules="{ required: false}">
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-slider
                      v-model="updateAuthService.ad1"
                      :step="1"
                      :max="9"
                      show-stops>
                    </el-slider>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="3">
                    <el-form-item label="二级授权人数:" :rules="{ required: false}">
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-slider
                      v-model="updateAuthService.ad2"
                      :step="1"
                      :max="9"
                      show-stops>
                    </el-slider>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="3">
                    <el-form-item label="三级授权人数:" :rules="{ required: false}">
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-slider
                      v-model="updateAuthService.ad3"
                      :step="1"
                      :max="9"
                      show-stops>
                    </el-slider>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="3">
                    <el-form-item label="四级授权人数:" :rules="{ required: false}">
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-slider
                      v-model="updateAuthService.ad4"
                      :step="1"
                      :max="9"
                      show-stops>
                    </el-slider>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="3">
                    <el-form-item label="五级授权人数:" :rules="{ required: false}">
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-slider
                      v-model="updateAuthService.ad5"
                      :step="1"
                      :max="9"
                      show-stops>
                    </el-slider>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="updateAuth = false" size="small">返回</el-button>
                <el-button type="primary" @click="subUpdate('updateAuthService')" size="small">提交</el-button>
              </div>
            </el-dialog>
            <span class="divide">|</span>
            <el-button
              type="text"
              size="small"
              @click="clear(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" style="float:right;padding:20px 20px">
      <el-pagination
        v-show="this.getAuthDefListService.length>0"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="parseInt(turnPageTotalNum)">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getStrategyList, addAuth, updateAuthSer, delAuth } from '~/config/api'

export default {
  name: 'relationSet',
  data () {
    return {
      relationSetLoading: true,
      getAuthDefListService: [],
      updateAuth: false,
      addAuth: false,
      turnPageTotalNum: 10,
      currentPage: 1,
      pageSize: 10,
      addAuthService: {
        ad1: 0,
        ad2: 1,
        ad3: 1,
        ad4: 0,
        ad5: 0,
        authDefine: '',
        authType: '0',
        alias: ''
      },
      updateAuthService: {
        ad1: 0,
        ad2: 1,
        ad3: 1,
        ad4: 0,
        ad5: 0,
        authDefine: '',
        authType: '0',
        alias: '',
        authId: ''
      }
    }
  },
  beforeMount () {
    this.getRelationList()
  },
  methods: {
    getRelationList () {
      const page = {
        currentPage: this.currentPage,
        turnPageShowNum: this.pageSize
      }
      getStrategyList(page).then(res => {
        var strategy = res.data.body.authDefList
        this.turnPageTotalNum = res.data.body.turnPageTotalNum
        this.getAuthDefListService = strategy
        for (var i = 0; i < strategy.length; i++) {
          if (strategy[i].authType === '0') {
            this.getAuthDefListService[i].authType = '无序'
          } else {
            this.getAuthDefListService[i].authType = '有序'
            // console.log(this.getAuthDefListService)
          }
          [this.getAuthDefListService[i].grade1, this.getAuthDefListService[i].grade2, this.getAuthDefListService[i].grade3, this.getAuthDefListService[i].grade4, this.getAuthDefListService[i].grade5] = this.getAuthDefListService[i].authDefine.split('')
          this.relationSetLoading = false
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getRelationList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRelationList()
    },
    subAdd (formName) { // 提价增添策略
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const setAuthCan = {
            ad1: String(this.addAuthService.ad1),
            ad2: String(this.addAuthService.ad2),
            ad3: String(this.addAuthService.ad3),
            ad4: String(this.addAuthService.ad4),
            ad5: String(this.addAuthService.ad5),
            authDefine: String(this.addAuthService.ad1) + String(this.addAuthService.ad2) + String(this.addAuthService.ad3) + String(this.addAuthService.ad4) + String(this.addAuthService.ad5),
            authType: this.addAuthService.authType,
            alias: this.addAuthService.alias
          }
          addAuth(setAuthCan).then(res => {
            if (res.data.body.errorCode === '0') {
              this.$notify({
                title: '成功',
                message: '添加策略成功',
                type: 'success'
              })
              this.getRelationList()
              this.addAuth = false
            }
          })
        } else {
          this.$message({
            duration: 1000,
            type: 'error',
            message: '填写内容错误，请仔细填写'
          })
          return false
        }
      })
    },
    subUpdate (formName) { // 提交修改策略
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const updateAuthCan = {
            ad1: String(this.updateAuthService.ad1),
            ad2: String(this.updateAuthService.ad2),
            ad3: String(this.updateAuthService.ad3),
            ad4: String(this.updateAuthService.ad4),
            ad5: String(this.updateAuthService.ad5),
            authDefine: String(this.updateAuthService.ad1) + String(this.updateAuthService.ad2) + String(this.updateAuthService.ad3) + String(this.updateAuthService.ad4) + String(this.updateAuthService.ad5),
            authType: this.updateAuthService.authType,
            alias: this.updateAuthService.alias,
            authId: this.updateAuthService.authId,
            areaNo: this.updateAuthService.authId
          }
          // console.log(this.updateAuthService)
          updateAuthSer(updateAuthCan).then(res => {
            if (res.data.body.errorCode === '0') {
              this.$notify({
                title: '成功',
                message: '修改策略成功',
                type: 'success'
              })
              this.getRelationList()
              this.updateAuth = false
            }
          })
        } else {
          this.$message({
            duration: 1000,
            type: 'error',
            message: '填写内容错误，请仔细填写'
          })
          return false
        }
      })
    },
    update (row) { //  获取选中的ID
      this.updateAuth = true
      this.updateAuthService.authId = row.authId
    },
    clear (row) {
      this.$confirm('确认删除策略?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delId = {
          authId: row.authId
        }
        // console.log(delId)
        delAuth(delId).then(res => {
          if (res.data.body.errorCode === '0') {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '策略删除成功!'
            })
            this.getRelationList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>