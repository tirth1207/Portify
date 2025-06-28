"use client"

// Inspired by react-hot-toast library
import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToasterToast = ToastProps & {
  id: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, 3000) // 3 seconds

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 3), // Limit to 3 toasts
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  const toast = React.useCallback(({ title, description, variant = "default" }: ToastProps) => {
    const id = genId()

    // Create toast element with close button
    const toastElement = document.createElement("div")
    toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out ${
      variant === "destructive"
        ? "bg-red-500 text-white border border-red-600"
        : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700"
    }`

    toastElement.style.animation = "slideInRight 0.3s ease-out"

    toastElement.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex-1 pr-3">
          ${title ? `<div class="font-semibold text-sm mb-1">${title}</div>` : ""}
          ${description ? `<div class="text-sm opacity-90">${description}</div>` : ""}
        </div>
        <button 
          class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          onclick="this.parentElement.parentElement.remove()"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `

    // Add CSS animation keyframes if not already added
    if (!document.querySelector("#toast-animations")) {
      const style = document.createElement("style")
      style.id = "toast-animations"
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Stack toasts properly
    const existingToasts = document.querySelectorAll("[data-toast]")
    toastElement.setAttribute("data-toast", id)
    toastElement.style.top = `${16 + existingToasts.length * 80}px`

    document.body.appendChild(toastElement)

    // Auto remove after 3 seconds
    const autoRemoveTimeout = setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.style.animation = "slideOutRight 0.3s ease-in"
        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.remove()
          }
        }, 300)
      }
    }, 3000)

    // Clear timeout if manually closed
    const closeButton = toastElement.querySelector("button")
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        clearTimeout(autoRemoveTimeout)
        toastElement.style.animation = "slideOutRight 0.3s ease-in"
        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.remove()
          }
        }, 300)
      })
    }

    const update = (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })
    const dismiss = () => {
      clearTimeout(autoRemoveTimeout)
      if (toastElement.parentNode) {
        toastElement.style.animation = "slideOutRight 0.3s ease-in"
        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.remove()
          }
        }, 300)
      }
      dispatch({ type: "DISMISS_TOAST", toastId: id })
    }

    dispatch({
      type: "ADD_TOAST",
      toast: {
        id,
        title,
        description,
        variant,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
      },
    })

    return {
      id: id,
      dismiss,
      update,
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast }
