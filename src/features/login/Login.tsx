import { LoginForm } from '../../components/login-form'

interface LoginFormProps {
  onLogin?: () => void;
}

const Login = (onLogin: LoginFormProps) => {
  return (
    <LoginForm className='px-40 py-10' onLogin={() => onLogin} />
  )
}

export default Login 