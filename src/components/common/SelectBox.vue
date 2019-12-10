<template>
  <div class="custom-select" :tabindex="tabindex" @blur="open = false">
    <div class="selected" :class="{open: open}" @click="open = !open">{{ selected }}</div>
    <div class="items" :class="{selectHide: !open}">
      <div
        class="item"
        v-for="(option, i) of options"
        :key="i"
        @click="selected=option; open=false; $emit('input', option)"
      >{{ option }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      selected: this.options.length > 0 ? this.options[0] : null,
      open: false
    };
  },
  mounted() {
    this.$emit("input", this.selected);
  }
};
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 40px;
  line-height: 40px;
  font-family: 'Lato';
  font-size: 13px;
}

.selected {
  background-color: #1c1b1b;
  border-radius: 3px;
  border: 1px solid #DBA628;
  color: #ffffff;
  padding-left: 8px;
  cursor: pointer;
  user-select: none;
}

.selected.open {
  border: 1px solid #DBA628;
  border-radius: 3px 3px 0px 0px;
}

.selected:after {
  position: absolute;
  content: "";
  top: 20px;
  right: 10px;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-color: #DBA628 transparent transparent transparent;
}

.items {
  color: #ffffff;
  border-radius: 0px 0px 3px 3px;
  overflow: hidden;
  border-right: 1px solid #DBA628;
  border-left: 1px solid #DBA628;
  border-bottom: 1px solid #DBA628;
  position: absolute;
  background-color: #080D0E;
  left: 0;
  right: 0;
}

.item {
  color: #ffffff;
  padding-left: 8px;
  cursor: pointer;
  user-select: none;
}

.item:hover {
  background-color: #DBA628;
}

.selectHide {
  display: none;
}
</style>