<template>
  <div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="variant"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
     <slot></slot>
    </b-alert>

  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      delete: 'warning'
    },
    show: {
      type: Boolean,
      delete: false
    }
  },
  watch: {
    show: {
      handler(val) {
        console.log(val)
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
      dismissSecs: 1,
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
