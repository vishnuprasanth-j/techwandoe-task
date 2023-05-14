import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider} from 'react-query'
import { faB,faPencil,faS,faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faB, faS, faPencil,faTrashCan)
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(


  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
