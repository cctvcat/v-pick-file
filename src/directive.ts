import { App, Directive, DirectiveBinding, Plugin } from 'vue-demi'
import { isReactive, markRaw } from 'vue-demi'

const PICK_BINDING = Symbol('pick_file_or_dir')
const hookPickLifeCycle: Directive = {
  created(el, binding) {
    if (el instanceof HTMLElement) {
      el[PICK_BINDING] = binding
      el.addEventListener('click', handleClick)
      if (binding.modifiers.drop) {
        el.addEventListener('dragover', handleDragover)
        el.addEventListener('drop', handleDrop)
      }
    }
  },
  updated(el, binding) {
    if (el instanceof HTMLElement) {
      if (!el[PICK_BINDING]) {
        el.addEventListener('click', handleClick)
        if (binding.modifiers.drop) {
          el.addEventListener('dragover', handleDragover)
          el.addEventListener('drop', handleDrop)
        }
      }
      el[PICK_BINDING] = binding
    }
  },
  beforeUnmount(el) {
    if (el instanceof HTMLElement) {
      el[PICK_BINDING] = null
      el.removeEventListener('click', handleClick)
      el.removeEventListener('dragover', handleDragover)
      el.removeEventListener('drop', handleDrop)
    }
  },
}

const ACCEPT_BINDING = Symbol('accept')
const hookAcceptLifeCycle: Directive = {
  created(el, binding) {
    if (el instanceof HTMLElement) {
      el[ACCEPT_BINDING] = binding
    }
  },
  updated(el, binding) {
    if (el instanceof HTMLElement) {
      el[ACCEPT_BINDING] = binding
    }
  },
  beforeUnmount(el) {
    if (el instanceof HTMLElement) {
      el[ACCEPT_BINDING] = null
    }
  },
}

const CAPTURE_BINDING = Symbol('capture')
const hookCaptureLifeCycle: Directive = {
  created(el, binding) {
    if (el instanceof HTMLElement) {
      el[CAPTURE_BINDING] = binding
    }
  },
  updated(el, binding) {
    if (el instanceof HTMLElement) {
      el[CAPTURE_BINDING] = binding
    }
  },
  beforeUnmount(el) {
    if (el instanceof HTMLElement) {
      el[CAPTURE_BINDING] = null
    }
  },
}

function handleDragover(ev: DragEvent) {
  ev.preventDefault()
}

function handleDrop(this: HTMLElement, ev: DragEvent) {
  const pickBinding = this[PICK_BINDING] as DirectiveBinding
  const files = ev.dataTransfer?.files
  if (files) {
    if (typeof pickBinding.value === 'function') {
      pickBinding.value(Array.from(files))
    } else if (Array.isArray(pickBinding.value)) {
      if (
        pickBinding.value.length === 2 &&
        isReactive(pickBinding.value[0]) &&
        (typeof pickBinding.value[1] === 'string' ||
          typeof pickBinding.value[1] === 'symbol')
      ) {
        pickBinding.value[0][pickBinding.value[1]] = Array.from(files)
      } else {
        pickBinding.value.length = 0
        pickBinding.value.push(...Array.from(files))
      }
    }
  }
  ev.preventDefault()
}

function handleClick(this: HTMLElement) {
  const input = document.createElement('input')
  input.type = 'file'

  const acceptBinding = this[ACCEPT_BINDING] as DirectiveBinding
  if (acceptBinding && acceptBinding.value) {
    input.accept = Array.isArray(acceptBinding.value)
      ? acceptBinding.value.join(',')
      : acceptBinding.value
  }

  const captureBinding = this[CAPTURE_BINDING] as DirectiveBinding
  if (captureBinding && captureBinding.value) {
    input.capture = captureBinding.value
  }

  const pickBinding = this[PICK_BINDING] as DirectiveBinding
  if (pickBinding.arg === 'dir') {
    input.webkitdirectory = true
  }

  if (pickBinding.modifiers.multiple) {
    input.multiple = true
  }

  input.onchange = () => {
    input.onchange = null
    if (typeof pickBinding.value === 'function') {
      pickBinding.value(Array.from(input.files!))
    } else if (Array.isArray(pickBinding.value)) {
      if (
        pickBinding.value.length === 2 &&
        isReactive(pickBinding.value[0]) &&
        (typeof pickBinding.value[1] === 'string' ||
          typeof pickBinding.value[1] === 'symbol')
      ) {
        pickBinding.value[0][pickBinding.value[1]] = Array.from(input.files!)
      } else {
        pickBinding.value.length = 0
        pickBinding.value.push(...Array.from(input.files!))
      }
    }

    input.value = ''
  }

  input.click()
}

export function createVPickFile(alias = 'pick') {
  return markRaw({
    install(app: App) {
      app.directive(`${alias}`, hookPickLifeCycle)
      app.directive(`${alias}-accept`, hookAcceptLifeCycle)
      app.directive(`${alias}-capture`, hookCaptureLifeCycle)
    }
  }) as Plugin
}
