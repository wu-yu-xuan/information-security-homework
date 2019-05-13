<template>
  <div id="app">
    <input v-model="value">
    <p>前缀: {{ front }} 长度: {{ front.length }}</p>
    <p>后缀: {{ back }} 长度: {{ back.length }}</p>
    <p>其他: {{ other }} 长度: {{ other.length }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class App extends Vue {
  value = "";
  front: string[] = [""];
  back: string[] = [""];
  other: string[] = [];
  @Watch("value")
  onChange(value: string) {
    const strArr = Array.from(value);
    this.front = strArr.reduce(
      (acc: string[], _, index) => {
        const tmp = value.slice(0, index);
        acc.includes(tmp) || acc.push(tmp);
        return acc;
      },
      [value]
    );
    this.back = strArr.reduce(
      (acc: string[], _, index) => {
        const tmp = value.slice(index, value.length);
        acc.includes(tmp) || acc.push(tmp);
        return acc;
      },
      [""]
    );
    this.other = strArr.reduce((acc: string[], cur, index) => {
      for (let i = index; i < strArr.length; i++) {
        const tmp = value.slice(index, i);
        if (
          !(
            this.front.includes(tmp) ||
            this.back.includes(tmp) ||
            acc.includes(tmp)
          )
        ) {
          acc.push(tmp);
        }
      }
      return acc;
    }, []);
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
