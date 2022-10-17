<script setup lang="ts">
const name = "<div>Testing <b>a</b> <i>component</i></div>"
</script>

<template>
  <div>
    <Docs />
    <div v-html="name"></div>
    Some stuff here :)
</div>
</template>

<docs lang="md">
# Low Poly Planetary System

```js
const name = 'a simple vite '
```
</docs>