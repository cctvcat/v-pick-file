[English](./README.md) | [简体中文](./README-zh-cn.md)

# v-pick-file

> 😀Make elements support selecting files and getting dragged files



## Installation

```
# or pnpm or yarn
npm install v-pick-file
```



## Usage

### 1.Register Directive

```js
//vue3
import { createApp } from 'vue'
import { createVPickFile } from 'v-pick-file'
import App from './App.vue'

const app = createApp(App)
app.use(createVPickFile())
app.mount('#app')
```



### 2.How to use

Use the v-pick directive on the target element, and when the element is clicked, a file selection box will pop up

v-pick directive supports receiving three types

(1) Callback function, the first parameter of the callback function is the selected file

(2) Receive an empty array or a ref that is an empty array for value

(3) An array of length 2 is received, the first element is reactive and the second element is the key value

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
    <button v-pick="handleGetFiles">select: callback</button>
    <button v-pick="files">select: ref</button>
    <button v-pick="[record, 'files']">select: reactive</button>
  </div>
</template>
```

#### 2.1 File type and capture action type

Provides v-pick-accept directive control over selecting file types and supports passing in arrays or strings

Provide v-pick-capture directive to control the type of capture action (generally only valid for mobile terminals, such as supporting taking photos to get pictures)

```html
<button 
  v-pick="handleGetFiles"
  v-pick-accept="['.png', '.jpg', '.jpeg']"
  v-pick-capture="'camera'"
>
  type and capture
</button>

<button 
  v-pick="handleGetFiles"
  v-pick-accept="'.png,.jpg,.jpeg'"
>
  type
</button>
```

#### 2.2 Multi-select

When v-pick directive uses the multiple modifier, it will be able to support multi-select files

```html
<button v-pick.multiple="handleGetFiles">multi-select</button>
```

#### 2.3 Dragged file

When v-pick directive uses the drop modifier, it will cause the element to receive the dragged file

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

#### 2.4 Dir

When v-pick directive uses the dir argument, it will become a selection directory, and after selecting a directory, all files in the directory will be obtained

```html
<button v-pick:dir="handleGetFiles">select dir</button>
```

#### 2.5 Alias

If v-pick directive conflicts with other directive names, you can pass a second parameter to the createVPickFile method to modify the registered directive name

For example, if the string file is passed, the relevant directives are changed to v-file, v-file-accept, v-file-capture

```ts
function createVPickFile(app: App<Element>, alias = 'pick')
```

#### 2.6 Selecting File function 

```ts
function getFiles(opts: InputFileAttrs = {}): Promise<File[]>
```



## License

[MIT](http://opensource.org/licenses/MIT)

