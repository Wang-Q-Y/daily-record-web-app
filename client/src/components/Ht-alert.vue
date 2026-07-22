<template>
  <div class="ht-alert-wrapper">
    <transition name="toast-fade">
      <b-alert
        v-if="dismissCountDown"
        :show="dismissCountDown"
        dismissible
        :variant="variant"
        class="ht-alert"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        <slot></slot>
      </b-alert>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'warning'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.showAlert()
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      dismissSecs: 3,
      dismissCountDown: 0
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
      this.$emit('close', false)
    }
  }
}
</script>

<style scoped>
.ht-alert-wrapper {
  position: fixed;
  top: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  width: 100%;
  max-width: 420px;
  padding: 0 16px;
  pointer-events: none;
}

.ht-alert-wrapper ::v-deep .alert {
  pointer-events: auto;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(20, 24, 28, 0.14);
  margin-bottom: 0;
  font-size: 14px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 600px) {
  .ht-alert-wrapper {
    top: 76px;
    max-width: none;
  }
}
</style>
