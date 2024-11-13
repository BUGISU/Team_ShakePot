import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import authJoinCSS from './MainCSS/authJoinCSS.module.css'
import fontStyles from '../../components/font.module.css'

function JoinPageCompany() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [cName, setCName] = useState('')
  const [mainProduct, setMainProduct] = useState('')
  const [cNumber, setCNumber] = useState('')
  const [gender, setGender] = useState('male')

  const handleHomeClick = () => {
    navigate('/main')
  }

  const handleJoin = async () => {
    if (!name || !email || !pw || !cName || !mainProduct || !cNumber) {
      alert('모든 필드를 입력하세요.')
      return
    }

    const joinData = {
      name,
      email,
      pw,
      cName,
      mainProduct,
      cNumber,
      gender,
      userType: 'COMPANY'
    }
    console.log(joinData) // 여기서 joinData 값 확인
    try {
      const response = await fetch('http://localhost:8080/api/auth/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(joinData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('가 실패:', errorData)
        alert(`가입에 실패했습니다: ${errorData.message || response.statusText}`)
      } else {
        console.log(JSON.stringify(joinData)) // 전송할 데이터 확인
        alert('회원가입 성공')
        navigate('/login')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('서버와 통신 중 문제가 발생했습니다.')
    }
  }

  return (
    <div className={authJoinCSS['join-container']}>
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
            onChange={e => setPw(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className={authJoinCSS['join-input-field']}
          />
        </div>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>회사명</label>
          <input
            type="text"
            value={cName}
            onChange={e => setCName(e.target.value)}
            placeholder="회사명을 입력하세요"
            className={authJoinCSS['join-input-field']}
          />
        </div>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>대표제품</label>
          <input
            type="text"
            value={mainProduct}
            onChange={e => setMainProduct(e.target.value)}
            placeholder="대표제품을 입력하세요"
            className={authJoinCSS['join-input-field']}
          />
        </div>
        <div className={authJoinCSS['join-input-group']}>
          <label className={authJoinCSS['join-input-label']}>사업자번호</label>
          <input
            type="text"
            value={cNumber}
            onChange={e => setCNumber(e.target.value)}
            placeholder="사업자번호를 입력하세요"
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

export default JoinPageCompany
