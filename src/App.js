import { useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  useEffect(() => {
    async function fetchSongs() {
      const {data, error} = await supabase.from('songs').select('*').order('created_at', {ascending: false})
      if (error) {
        console.error('Error fetching songs:', error)
      } else {
        console.log('Songs fetched:', data)
      }
    }
    fetchSongs()
  }, [])
  return <div>Hello World</div>
}

export default App