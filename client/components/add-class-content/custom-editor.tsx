import React, { useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const ReactCodeMirrorExample = () => {
  const editorRef = useRef<EditorView | null>(null) // To store the EditorView

  const handleEditorLoad = (view: EditorView) => {
    editorRef.current = view
    // console.log('EditorView instance:', view)
  }

  const logPositionInfo = () => {
    if (editorRef.current) {
      const view = editorRef.current
      const state = view.state

      // Example: Use mapPos to map positions
      const position = 10 // Example position in the document
      const posInfo = state.doc.lineAt(position)

      console.log('Mapped Position Info:', posInfo)
    }
  }

  const logSelectedTextInfo = () => {
    if (editorRef.current) {
      const view = editorRef.current
      const state = view.state

      // Example: Get the selected text
      console.log('FROM POSITION:', state.selection.main.from)
      console.log('END POSITION:', state.selection.main.to)

      const selectedText = state.sliceDoc(state.selection.main.from, state.selection.main.to)

      console.log('Selected Text:', selectedText)
    }
  }

  return (
    <div>
      <CodeMirror
        value={`const greeting = "Hello, World!";`}
        height="200px"
        extensions={[javascript()]}
        theme={oneDark}
        onUpdate={(viewUpdate: { view: EditorView }) => handleEditorLoad(viewUpdate.view)}
      />
      <button onClick={logPositionInfo}>Log Position Info</button>
      <button onClick={logSelectedTextInfo}>Log Selected Text Info</button>
    </div>
  )
}

export default ReactCodeMirrorExample
