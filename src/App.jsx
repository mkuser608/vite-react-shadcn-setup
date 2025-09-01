import { useState } from 'react'
import { Button } from '@/components/ui/button'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 hover:drop-shadow-lg transition-all" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 hover:drop-shadow-lg transition-all" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8">Vite + React + shadcn/ui</h1>
      <div className="space-y-4 text-center">
        <Button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>
        <p className="text-muted-foreground">
          Edit <code className="bg-muted px-1 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
