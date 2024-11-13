import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../routes/AuthContext'
import fontStyles from '../../components/font.module.css'
import mainLayout from './MainCSS/mainLayoutCSS.module.css'

const MainHeader: React.FC = () => {
  const navigate = useNavigate()
  const {isLoggedIn, login, logout} = useAuth() // AuthContext 에서 상태를 가져옴

  const handleHomeClick = () => {
    navigate('/main')
  }

  const handleLogin = () => {
    login() // 로그인 시 필요한 매개변수를 추가하세요.
    navigate('/mainPageLogin')
  }

  const handleLogout = () => {
    logout() // 로그아웃 상태로 변경
    navigate('/main') // main 페이지로 이동
  }

  // 2024-10-31 handle MyPage
  const handleMyPage = () => {
    const userType = sessionStorage.getItem('userType')
    const uno = sessionStorage.getItem('uno')

    // 2024-10-31 14:30: 사용자 타입에 따른 마이페이지 경로 설정
    if (isLoggedIn && userType) {
      if (uno) {
        // uno가 존재하는지 확인
        if (userType.toLowerCase() === 'consumer') {
          navigate(`/mypage/mypageconsumer/${uno}`)
        } else if (userType.toLowerCase() === 'admin') {
          navigate(`/mypage/mypageadmin/${uno}`)
        } else if (userType.toLowerCase() === 'company') {
          navigate(`/mypage/mypagecompany/${uno}`)
        }
      } else {
        alert('유저 정보를 찾을 수 없습니다. 다시 로그인 해주세요.')
        navigate('/login')
      }
    } else {
      alert('로그인이 필요합니다.')
      navigate('/login')
    }
  }

  return (
    <div>
      {/* 상단 메뉴바 */}
      <header className={mainLayout.header}>
        <nav className={mainLayout['header-left']}>
          <Link to="/main">
            <div className={`${fontStyles['knewave-regular']} ${mainLayout.logo}`}>
              ShakePot
            </div>
          </Link>
        </nav>
        <nav className={mainLayout['header-right']}>
          <div>
            <Link to="/category/taste">Taste</Link>
            <Link to="/category/sugar">Sugar</Link>
            <Link to="/category/protein">Protein</Link>
            <Link to="/category/calorie">Calorie</Link>
            <Link to="/customerservice/customerservice">고객센터</Link>
          </div>
          {isLoggedIn ? (
            <>
              <button className={mainLayout['mypage-btn']} onClick={handleMyPage}>
                마이페이지
              </button>
              <button className={mainLayout['logout-btn']} onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className={mainLayout['login-btn']}>로그인</button>
            </Link>
          )}
        </nav>
      </header>
    </div>
  )
}

export default MainHeader
