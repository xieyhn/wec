<template>
  <div class="layout">
    <header class="navbar">
      <div class="navbar-wrapper">
        <div class="logo-container">Wec</div>
      </div>
    </header>
    <div class="main-container">
      <CompSidebar />
      <div class="content">
        <div class="markdown-body">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CompSidebar from '@/components/CompSidebar/index.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    CompSidebar
  }
})
</script>

<style scoped lang="scss">
.layout {
  padding-top: 55px;
  .navbar {
    position: fixed;
    width: 100%;
    height: 55px;
    top: 0;
    left: 0;
    z-index: 20;
    padding: 0 32px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;

    .logo-container {
      font-size: 18px;
      color: #000;
    }
  }

  .main-container {
    padding-left: 300px;
    .content {
      overflow: hidden;
      padding-bottom: 40px;
    }
  }
}
</style>
