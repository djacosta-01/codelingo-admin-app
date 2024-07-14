import { supabase } from './supabaseClient/supabaseClient'

const SignOut = () => {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log('Error logging out:', error.message)
  }

  return <button onClick={handleSignOut}>Sign Out</button>
}

export default SignOut
