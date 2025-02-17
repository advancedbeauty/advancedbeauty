import { CodeResponse, useGoogleLogin } from '@react-oauth/google'
import { axiosGoogleAuth } from './axios-api'

export const responseGoogle = async (
  authResult: CodeResponse,
  setError: (error: string) => void
) => {
  try {
    if (authResult.code) {
      console.log('Google Auth Code:', authResult.code)
      // Handle Google OAuth account
      const result = await axiosGoogleAuth(authResult.code);
      console.log(result.data);
    }
  } catch (error) {
    console.error('Error while requesting Google code', error)
    setError('Auth failed')
  }
}

export const handleGoogleAuthError = (
  errorResponse: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>,
  setError: (error: string) => void
) => {
  console.error('Auth error:', errorResponse)
  setError(`Auth failed`)
}

export const createGoogleAuthHandler = (setError: (error: string) => void) => {
  return useGoogleLogin({
    onSuccess: (authResult) => responseGoogle(authResult, setError),
    onError: (errorResponse) => handleGoogleAuthError(errorResponse, setError),
    flow: 'auth-code',
  })
}
