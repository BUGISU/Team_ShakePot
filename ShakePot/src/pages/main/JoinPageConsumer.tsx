import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import authJoinCSS from './MainCSS/authJoinCSS.module.css'
import fontStyles from '../../components/font.module.css'

function JoinPageUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setpw] = useState('')
  const [gender, setGender] = useState('male')
  const [alertMessage, setAlertMessage] = useState('') // 알림 메시지 상태
  const [showAlert, setShowAlert] = useState(false) // 알림 표시 상태

  const handleHomeClick = () => {
    navigate('/main')
  }

  const handleJoin = async () => {
    const joinData = {
      name,
      email,
      pw,
      gender,
      userType: 'CONSUMER'
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(joinData)
      })

      if (response.ok) {
        alert('회원가입 성공')
        navigate('/login') // 성공 후 로그인 페이지로 이동
      } else {
        const errorData = await response.json() // JSON으로 변환하여 에러 메시지 읽기
        setAlertMessage(`회원가입 실패: ${errorData.message || '오류가 발생했습니다.'}`)
        setShowAlert(true) // 알림 표시

        // 3초 후 알림 숨기기
        setTimeout(() => {
          setShowAlert(false)
        }, 3000)
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류 발생:', error)
      setAlertMessage('중복된 이메일이 있습니다.')
      setShowAlert(true)

      // 3초 후 알림 숨기기
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
  }

  return (
    <div className={authJoinCSS['join-container']}>
      {showAlert && <div className={authJoinCSS['alert-message']}>{alertMessage}</div>}
      <button className={authJoinCSS['home-button']} onClick={handleHomeClick}>
        <AiFillHome size={32} color="#272C46" />
      </button>
      <h1 className={`${fontStyles['knewave-regular']}`} style={{color: '#272c46'}}>
        ShakePot
      </h1>
      <div className={authJoinCSS['join-box']}>
        <h2 style={{color: 'black', fontSize: '20px'}}>회원가입</h2>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className={authJoinCSS['join-input-field']}
          />
        </div>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>이메일 (아이디)</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className={authJoinCSS['join-input-field']}
          />
        </div>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>비밀번호</label>
          <input
            type="password"
            value={pw}
            onChange={e => setpw(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className={authJoinCSS['join-input-field']}
          />
        </div>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>성별</label>
          <div className={authJoinCSS['join-gender-options']}>
            <label style={{color: gender === 'male' ? 'black' : 'gray'}}>
              <input
                style={{marginRight: '10px'}}
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              남성
            </label>
            <label style={{color: gender === 'female' ? 'black' : 'gray'}}>
              <input
                style={{marginRight: '10px'}}
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              여성
            </label>
          </div>
        </div>
        <div className={authJoinCSS['join-button-group']}>
          <button onClick={handleJoin} className={authJoinCSS['join-btn']}>
            가입
          </button>
          <button
            onClick={() => navigate('/login')}
            className={authJoinCSS['cancel-btn']}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinPageUser
