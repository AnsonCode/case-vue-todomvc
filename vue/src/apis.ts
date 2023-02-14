const baseUrl = 'http://localhost:9991'

export type ID = string

export type TodoItem = {
  id: ID
  title: string
  completed: boolean
}

type RequestOptions = Record<string, any> & { method: string }

export async function request<T>(url: string, opts?: RequestOptions) {
  let body = null
  if (opts) {
    const { method, ...rest } = opts
    body = rest ?? {}
  }
  const resp = await fetch(`${baseUrl}/operations/${url}`, {
    method: opts?.method,
    body: opts?.method.toLowerCase() !== 'get' && body ? JSON.stringify(body) : null
  })
  if (resp.ok) {
    return resp.json().then(res => ({
      data: res.data.data as T,
      error: null
    }))
  } else {
    return {
      data: null,
      error: resp.statusText
    }
  }
}

export async function getAllTodos(callback: (data: TodoItem[]) => void) {
  const resp = await fetch(`${baseUrl}/operations/GetAllTodos?wg_live=true`)
  if (resp.ok) {
    const reader = resp.body?.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const read = await reader?.read()
      try {
        if (read?.done) {
          break
        }
        if (read?.value) {
          const json = JSON.parse(read.value)
          callback(json.data.data as TodoItem[])
        }
      } catch (error) {
        //
      }
    }
  }
}

export async function completedTodo(id: ID, completed: boolean) {
  const { error } = await request('CompleteTodo', { id, completed, method: 'post' })
  return !error
}

export async function completedAllTodos(completed: boolean) {
  const { error } = await request('CompleteAllTodos', { completed, method: 'post' })
  return !error
}

export async function createTodo(title: string) {
  const { error, data } = await request('CreateTodo', { method: 'post', title })
  return error ? false : data
}

export async function updateTitle(id: string, title: string) {
  const { error } = await request('UpdateTodoTitle', { method: 'post', id, title })
  return !error
}

export async function removeTodo(id: string) {
  const { error } = await request('RemoveTodo', { method: 'post', id })
  return !error
}

export async function removeCompleted() {
  const { error } = await request('RemoveCompleted', { method: 'post' })
  return !error
}