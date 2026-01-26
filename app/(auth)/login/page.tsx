import LoginUi from '@/module/auth/components/loginUi'
import { requireUnAuth } from '@/module/auth/utils/auth-util'


const LoginPage = async() => {
  await requireUnAuth()
  return (
    <div>
        <LoginUi/>
    </div>
    
  )
}

export default LoginPage