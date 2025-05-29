import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import WandEditor from './components/WandEditor'
import './styles/App.css'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="app-header">
          <h1>Noita Wand Simulator</h1>
        </header>
        <main className="app-main">
          <WandEditor />
        </main>
      </div>
    </DndProvider>
  )
}

export default App