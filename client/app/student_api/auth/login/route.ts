import { login } from '@/app/auth/login/actions'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const formData = new FormData()
  formData.set('email', email)
  formData.set('password', password)

  const response = await login(formData)

  if (response?.message) return Response.json({ message: response.message, error: false })

  return Response.json({ error: 'There was an error loggin you in' })
}
