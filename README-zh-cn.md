[English](./README.md) | [简体中文](./README-zh-cn.md)

# v-pick-file

> 😀使元素支持选择文件和获取拖拽文件




## 安装

```
# or pnpm or yarn
npm install v-pick-file
```



## 用法

### 1.注册指令

可以新建一个文件

```js
//vue3
import { createApp } from 'vue'
import { createVPickFile } from 'v-pick-file'
import App from './App.vue'

const app = createApp(App)
app.use(createVPickFile())
app.mount('#app')
```



### 2.使用

在目标元素上使用 v-pick 指令，当元素被点击时，则会弹出文件选择框。

v-pick 支持接收三种类型

(1) 回调函数，回调函数第一个参数为选择的文件

(2) 接收一个空数组或为 value 为空数组的 ref

(3) 接收一个长度为2的数组，第一个元素为 reactive，第二个元素为key值

```vue
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

function handleGetFiles(files: File[]) {
  console.log('callback', files)
}

const files = ref<File[]>([])
watch(files.value, (val) => {
  console.log('ref changed', val)
})

const record = reactive({
  files: [],
})
watch(
  () => record.files,
  (val) => {
    console.log('record.files changed', val)
  }
)
</script>

<template>
  <div>
    <button v-pick="handleGetFiles">回调选择文件</button>
    <button v-pick="files">Ref选择文件</button>
    <button v-pick="[record, 'files']">Reactive选择文件</button>
  </div>
</template>
```

#### 2.1 文件类型和捕获动作类型

提供 v-pick-accept 控制选择文件类型，支持传入数组或字符串

提供 v-pick-capture 控制捕获动作类型(一般只对移动端有效，如可以支持拍照获取图片)

```html
<button 
  v-pick="handleGetFiles"
  v-pick-accept="['.png', '.jpg', '.jpeg']"
  v-pick-capture="'camera'"
>
  类型和capture
</button>

<button 
  v-pick="handleGetFiles"
  v-pick-accept="'.png,.jpg,.jpeg'"
>
  类型
</button>
```

#### 2.2 多选文件

当 v-pick 使用 multiple 修饰符将可以支持多选文件

```html
<button v-pick.multiple="handleGetFiles">选择多个文件</button>
```

#### 2.3 获取拖拽文件

当 v-pick 使用 drop 修饰符将可以使元素接收拖拽文件

```vue
<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
const dragEnter = ref(false)
</script>

<template>
  <div>
    <div 
      v-pick.drop="files"
      class="drop-box"
      :class="dragEnter ? 'drag-enter' : ''"
      @dragenter="dragEnter = true"
      @dragleave="dragEnter = false"
      @drop="dragEnter = false"
    >
      <div v-for="item in files"> 
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-box {
  width: 500px;
  height: 300px;
  overflow-y: auto;
  border: 2px solid red;
}

.drag-enter {
  border: 2px solid blue;
}
</style>

```

#### 2.4 选择目录

当 v-pick 使用 dir 参数时，将变成选择目录，选择目录后会获取到目录下所有文件

```html
<button v-pick:dir="handleGetFiles">选择目录</button>
```

#### 2.5 使用别名

若 v-pick 与其它指令名冲突，可以给 createVPickFile 方法传递第二个参数修改注册的指令名

例如传递字符串 file，则相关指令使用变为 v-file、v-file-accept、v-file-capture

```ts
function createVPickFile(alias = 'pick')
```

#### 2.6 直接使用选择文件函数

```ts
function getFiles(opts: InputFileAttrs = {}): Promise<File[]>
```



## 使用协议

[MIT](http://opensource.org/licenses/MIT)
