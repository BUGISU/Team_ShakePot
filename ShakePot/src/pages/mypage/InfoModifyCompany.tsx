import React, {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import styles from './MyPageCSS/infoModifyCSS.module.css'

interface CompanyData {
  name: string
  userId: string
  password: string
  email: string
  cName: string
  mainProduct: string
  cNumber: string
  gender: string
  active: string
}

const InfoModifyCompany: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 전달받은 데이터를 초기 상태로 설정
  const {state} = location
  const initialData = state?.companyData || {
    name: '',
    userId: '',
    password: '',
    email: '',
    cName: '',
    mainProduct: '',
    cNumber: '',
    gender: '',
    active: ''
  }

  const [companyData, setCompanyData] = useState<CompanyData>(initialData)

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setCompanyData({...companyData, [name]: value})
  }

  // 수정 완료 후 데이터 반영
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const confirmed = window.confirm('수정하시겠습니까?')
    if (confirmed) {
      // 수정된 데이터를 MyPageAdmin으로 navigate를 통해 전달
      navigate('/mypageAdmin', {state: {updatedData: companyData}})
    }
  }

  // 삭제 핸들러
  const handleDelete = () => {
    const deleteConfirmed = window.confirm('정말 삭제하시겠습니까?')
    if (deleteConfirmed) {
      // 삭제된 데이터를 MyPageAdmin으로 전달
      navigate('/mypageAdmin', {state: {deletedId: companyData.userId}})
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
        <h2 className={styles['title']}>회사 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={companyData.userId}
              readOnly
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={companyData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={companyData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="cName">회사명</label>
            <input
              type="text"
              id="cName"
              name="cName"
              value={companyData.cName}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="mainProduct">대표제품</label>
            <input
              type="text"
              id="mainProduct"
              name="mainProduct"
              value={companyData.mainProduct}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="cNumber">사업자번호</label>
            <input
              type="text"
              id="cNumber"
              name="cNumber"
              value={companyData.cNumber}
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
                  checked={companyData.gender === '남성'}
                  onChange={handleInputChange}
                />
                <label>남성</label>
              </div>
              <div className={styles['radio-item']}>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={companyData.gender === '여성'}
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
                  checked={companyData.active === '활성'}
                  onChange={handleInputChange}
                />
                <label>활성</label>
              </div>
              <div className={styles['radio-item']}>
                <input
                  type="radio"
                  name="active"
                  value="비활성"
                  checked={companyData.active === '비활성'}
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

export default InfoModifyCompany
