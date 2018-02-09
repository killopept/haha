<template>
  <div style="padding: 20px 35px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="个推" name="first">
        <div style="width: 70%; margin: 0 auto">
          <GeTui></GeTui>
        </div>
      </el-tab-pane>
      <el-tab-pane label="友盟" name="second">
        <div style="width: 70%; margin: 0 auto">
          <YouMeng></YouMeng>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import GeTui from './GeTui/GeTui'
  import YouMeng from './YouMeng/YouMeng'

  export default {
    data () {
      return {
        activeName: 'first'
      }
    },
    components: {
      GeTui,
      YouMeng
    }
  }
</script>