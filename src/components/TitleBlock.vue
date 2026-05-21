<template>
  <div class="title-block">
    <h1 class="title-main">成都科幻地图</h1>
    <p class="title-sub">CHENGDU SCIENCE FICTION MAP</p>
    <div class="title-rule"></div>
    <div class="credits">
      <div class="credit-line">
        <span class="credit-role">指 挥 官</span>
        <span class="credit-name">华 文</span>
      </div>
      <div class="credit-line">
        <span class="credit-role">领 航 员</span>
        <span class="credit-name">宇 宙 探 索 者</span>
      </div>
      <div class="credit-line">
        <span class="credit-role">安全顾问</span>
        <span class="credit-name">星 际 联 盟</span>
      </div>
      <div class="credit-line">
        <span class="credit-role">医疗顾问</span>
        <span class="credit-name">生 命 维 持 组</span>
      </div>
      <div class="credit-line">
        <span class="credit-role">制图顾问</span>
        <span class="credit-name">星 图 绘 制 局</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-block {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 50;
  color: #FDF5E6;
}
.title-main {
  font-family: 'Noto Serif SC', serif;
  font-weight: bold;
  font-size: 32px;
  letter-spacing: 0.15em;
  line-height: 1.2;
  margin: 0;
}
.title-sub {
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #F5F1E1;
  margin: 4px 0 10px 0;
}
.title-rule {
  width: 60px;
  height: 0;
  border-top: 1px solid rgba(253, 245, 230, 0.3);
  margin-bottom: 12px;
}
.credits {
  font-family: 'Noto Serif SC', serif;
}
.credit-line {
  display: flex;
  gap: 12px;
  font-size: 10px;
  line-height: 1.6;
}
.credit-role {
  color: #F8E8C0;
  min-width: 60px;
  letter-spacing: 0.1em;
}
.credit-name {
  color: #D4CFBA;
  letter-spacing: 0.15em;
}
</style>
