<template>
  <div class="compass" :class="{ mobile: isMobile }" @click="onCompassClick">
    <div class="compass-outer-ring"></div>
    <div class="compass-inner-ring"></div>
    <div class="compass-octagram"></div>
    <div class="compass-labels">
      <span class="compass-label label-n">N</span>
      <span class="compass-label label-s">S</span>
      <span class="compass-label label-w">W</span>
      <span class="compass-label label-e">E</span>
    </div>
    <button class="reset-btn" @click="$emit('reset-camera')">✦</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isMobile: boolean
}>()

const emit = defineEmits<{
  (e: 'reset-camera'): void
}>()

function onCompassClick() {
  if (props.isMobile) {
    emit('reset-camera')
  }
}
</script>

<style scoped>
.compass {
  position: fixed;
  right: 30px;
  top: 30px;
  z-index: 50;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.compass-outer-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(253, 245, 230, 0.4);
  border-radius: 50%;
}

.compass-inner-ring {
  position: absolute;
  width: 72px;
  height: 72px;
  border: 1px solid rgba(253, 245, 230, 0.25);
  border-radius: 50%;
}

.compass-octagram {
  position: absolute;
  width: 40px;
  height: 40px;
  background: #C8A850;
  clip-path: polygon(
    50% 0%, 62% 38%, 100% 50%, 62% 62%,
    50% 100%, 38% 62%, 0% 50%, 38% 38%
  );
  opacity: 0.5;
}

.compass-labels {
  position: absolute;
  width: 100%;
  height: 100%;
}

.compass-label {
  position: absolute;
  font-family: 'Noto Serif SC', serif;
  font-weight: bold;
  font-size: 11px;
  color: #FDF5E6;
}

.label-n {
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  color: #FFD700;
}

.label-s {
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
}

.label-w {
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
}

.label-e {
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
}

.reset-btn {
  position: absolute;
  top: 110px;
  background: transparent;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  color: #FFD700;
  font-size: 20px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
}
.reset-btn:hover {
  border-color: #FFD700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.7);
}

/* Mobile styles */
@media (max-width: 479px) {
  .compass {
    right: 10px;
    top: 10px;
    width: 64px;
    height: 64px;
  }
  .compass-outer-ring {
    width: 64px;
    height: 64px;
  }
  .compass-inner-ring {
    width: 46px;
    height: 46px;
  }
  .compass-octagram {
    width: 26px;
    height: 26px;
  }
  .compass-label {
    font-size: 8px;
  }
  .label-n { top: 3px; }
  .label-s { bottom: 3px; }
  .label-w { left: 3px; }
  .label-e { right: 3px; }
  .reset-btn {
    display: none;
  }
}
</style>
