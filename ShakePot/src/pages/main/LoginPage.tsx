import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import authLoginCSS from './MainCSS/authLoginCSS.module.css'
import fontStyles from '../../components/font.module.css'
import {useAuth} from '../../routes/AuthContext' // useAuth import

interface LoginResponse {
  token?: string
  uno?: string // uno 타입을 정의합니다. 실제 타입에 따라 변경하세요.
  userType?: string // userType 타입을 정의합니다. 실제 타입에 따라 변경하세요.
  message?: string // 에러 메시지 타입 정의
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('') // 이메일의 타입을 정의
  const [pw, setPw] = useState<string>('') // 비밀번호의 타입을 정의

  const {isLoggedIn, login} = useAuth() // useAuth 훅 사용하여 로그인 상태 관리

  const handleHomeClick = () => {
    if (isLoggedIn) {
      navigate('/mainPageLogin')
    } else {
      navigate('/main')
    }
  }

  // fetch를 사용하여 로그인 요청
  const handleLogin = async () => {
    // 이메일과 비밀번호가 비어 있는지 체크
    if (!email || !pw) {
      alert('이메일과 비밀번호를 입력하세요.')
      return
    }

    const loginData = {email, pw}
    console.log('로그인 데이터:', JSON.stringify(loginData)) // 요청 본문 로그 추가

    try {
      const response = await fetch(`http://localhost:8080/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData) // JSON 문자열로 변환
      })

      // 응답 상태 확인
      if (!response.ok) {
        const errorData: LoginResponse = await response.json() // JSON 형식으로 변환
        alert(`로그인 실패: ${errorData.message || '서버 오류 발생'}`)
        return
      }

      const data: LoginResponse = await response.json() // JSON 응답 처리
      console.log(data) // 응답 데이터 확인

      // 로그인 성공 시 처리
      sessionStorage.setItem('token', data.token || '') // 데이터가 없을 경우 빈 문자열을 저장
      sessionStorage.setItem('email', email)
      sessionStorage.setItem('uno', data.uno || '') // 데이터가 없을 경우 빈 문자열을 저장
      login(email, data.userType || '', data.token || '') // 데이터가 없을 경우 빈 문자열을 전달
      navigate('/mainPageLogin')
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  const handleJoin = () => {
    navigate('/join')
  }

  return (
    <div className={authLoginCSS['login-container']}>
      {/* 홈 버튼 */}
      <button className={authLoginCSS['home-button']} onClick={handleHomeClick}>
        <AiFillHome size={32} color="#272c46" />
      </button>
      <h1 className={`${fontStyles['knewave-regular']}`} style={{color: '#272c46'}}>
        ShakePot
      </h1>
      <div className={authLoginCSS['login-box']}>
        <h2 style={{color: 'black', fontSize: '20px'}}>로그인</h2>
        <div className={authLoginCSS['input-group']}>
          <label className={authLoginCSS['input-label']}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className={authLoginCSS['input-field']}
          />
        </div>
        <div className={authLoginCSS['input-group']}>
          <label className={authLoginCSS['input-label']}>비밀번호</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className={authLoginCSS['input-field']}
          />
        </div>
        <div className={authLoginCSS['button-group']}>
          <button onClick={handleLogin} className={authLoginCSS['login-btn']}>
            로그인
          </button>
          <button onClick={handleJoin} className={authLoginCSS['join-btn']}>
            회원 가입
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
