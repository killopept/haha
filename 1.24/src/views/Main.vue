<template>
  <div class="app-main">
    <app-header></app-header>
    <div class="app-content">
      <div class="app-page-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '^/Header'

export default {
  name: 'app-main',
  components: {
    AppHeader
  }
}
</script>
<style src="#/style/index.css"></style>
<style lang="scss" src="#/style/page.scss"></style>
