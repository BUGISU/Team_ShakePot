import React, {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import styles from './MyPageCSS/infoModifyCSS.module.css'

interface ConsumerData {
  name: string
  userId: string
  password: string
  email: string
  gender: string
  active: string
}

const InfoModifyConsumer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 전달받은 데이터를 초기 상태로 설정
  const {state} = location
  const initialData = state?.userData || {
    name: '',
    userId: '',
    password: '',
    email: '',
    gender: '',
    active: ''
  }

  const [consumerData, setConsumerData] = useState<ConsumerData>(initialData)

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setConsumerData({...consumerData, [name]: value})
  }

  // 수정 완료 후 데이터 반영
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const confirmed = window.confirm('수정하시겠습니까?')
    if (confirmed) {
      // 수정된 데이터를 MyPageAdmin으로 navigate를 통해 전달
      navigate('/mypageAdmin', {state: {updatedData: consumerData}})
    }
  }

  // 삭제 핸들러
  const handleDelete = () => {
    const deleteConfirmed = window.confirm('정말 삭제하시겠습니까?')
    if (deleteConfirmed) {
      // 삭제된 데이터를 MyPageAdmin으로 전달
      navigate('/mypageAdmin', {state: {deletedId: consumerData.userId}})
    }
  }

  const handleCancel = () => {
    const cancelConfirmed = window.confirm('취소하시겠습니까?')
    if (cancelConfirmed) {
      navigate(-1) // 이전 페이지로 돌아가기
    }
  }

  return (
    <div className={styles['info-modify-page']}>
      <div className={styles['info-modify-container']}>
        <h2 className={styles['title']}>소비자 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={consumerData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={consumerData.userId}
              readOnly
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={consumerData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={consumerData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label>성별</label>
            <div className={styles['radio-group']}>
              <div className={styles['radio-item']}>
                <input
                  type="radio"
                  name="gender"
                  value="남성"
                  checked={consumerData.gender === '남성'}
                  onChange={handleInputChange}
                />
                <label>남성</label>
              </div>
              <div className={styles['radio-item']}>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={consumerData.gender === '여성'}
                  onChange={handleInputChange}
                />
                <label>여성</label>
              </div>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label>활성화 상태</label>
            <div className={styles['radio-group']}>
              <div className={styles['radio-item']}>
                <input
                  type="radio"
                  name="active"
                  value="활성"
                  checked={consumerData.active === '활성'}
                  onChange={handleInputChange}
                />
                <label>활성</label>
              </div>
              <div className={styles['radio-item']}>
                <input
                  type="radio"
                  name="active"
                  value="비활성"
                  checked={consumerData.active === '비활성'}
                  onChange={handleInputChange}
                />
                <label>비활성</label>
              </div>
            </div>
          </div>

          <div className={styles['form-actions']}>
            <button type="submit" className={styles['confirm-button']}>
              확인
            </button>
            <button
              type="button"
              className={styles['cancel-button']}
              onClick={handleCancel}>
              취소
            </button>
            <button
              type="button"
              className={styles['delete-button']}
              onClick={handleDelete}>
              삭제
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InfoModifyConsumer
