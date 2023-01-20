import { useEffect, useState } from 'react'
import Input from './components/Input'
import ResultList from './components/ResultList'
import { useDebounce } from './hooks/useDebounce'
import { DataType, LOADING_STATE } from './types/types'

function App() {
  const [value, setValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<LOADING_STATE>(LOADING_STATE.NONE)
  const [data, setData] = useState<DataType[]>([])
  const [localData, setLocalData] = useState<string[]>([])
  const debouncedValue = useDebounce(value)
  let controller = new AbortController()
  let signal

  const fetchData = async () => {
    try {
      if (controller) {
        controller.abort()
        console.log('fetch - abort controller?')
      }
      controller = new AbortController()
      signal = controller.signal
      const res = await fetch('https://jsonplaceholder.typicode.com/comments', {
        signal: signal,
      })
      // Response {type: 'cors', url: 'https://jsonplaceholder.typicode.com/comments', redirected: false, status: 200, ok: true, …}
      // body: (...)
      // bodyUsed: false
      // headers: Headers {}
      // ok: true
      // redirected: false
      // status: 200
      // statusText: ""
      // type: "cors"
      // url: "https://jsonplaceholder.typicode.com/comments"
      const data: DataType[] = await res.json()
      // data (500) [{…}, {…}, ...]
      // {
      //   "postId": 1,
      //   "id": 2,
      //   "name": "quo vero reiciendis velit similique earum",
      //   "email": "Jayne_Kuhic@sydney.com",
      //   "body": "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et"
      // },
      setData(data.filter((item) => item.email.includes(debouncedValue)))
      setIsLoading(LOADING_STATE.COMPLETE)
    } catch (error) {
      console.log('error', error)
      setIsLoading(LOADING_STATE.ERROR)
    }
  }

  const delayedFetch = (debouncedValue: string, signal?: AbortSignal) => {
    // Local data:
    // check with delay: type 'ber' to 'berry' for overlap fetch response with still showing cucumber w/o abort
    const fruits = ['cranberry', 'rasberry', 'strawberry', 'cucumber']
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (signal?.aborted) {
          console.log('local - abort signal')
          reject(signal.reason)
        }
        resolve(
          fruits.filter((fruit) =>
            fruit.toLocaleLowerCase().includes(debouncedValue.toLocaleLowerCase())
          )
        )
        resolve(fetchData())
      }, Math.random() * 1500)
    })
  }

  useEffect(() => {
    const signal = controller.signal
    // Show loading spinner
    setIsLoading(LOADING_STATE.LOADING)
    ;(async () => {
      if (!value) {
        console.log('return -> no value')
        return
      }
      // When new value -> fetch data
      if (debouncedValue) {
        // fetchData()
        // delayedFetch(debouncedValue)
      }
      const data = (await delayedFetch(debouncedValue, signal)) as string[] // type: uknown
      console.log('useEffect, data', data)
      setLocalData(data)
    })()
    // When clear input -> clear out data list
    if (!debouncedValue) {
      setData([])
      setLocalData([])
      setIsLoading(LOADING_STATE.NONE)
    }
    // ! Uncaught (in promise) cancel request
    return () => {
      controller.abort('cancel request')
      console.log('useEffect, controller abort?')
    }
  }, [debouncedValue])

  return (
    <div className='App'>
      <Input value={value} setValue={setValue} />
      <div className='container'>
        <ResultList isLoading={isLoading} data={data} type='fetch' />
        <ResultList isLoading={isLoading} data={localData} type='local' />
      </div>
    </div>
  )
}

export default App
