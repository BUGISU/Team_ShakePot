import React, {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import inquiryCSS from './customerServiceCSS/inquiryCSS.module.css' // Assuming CSS module is correctly linked

const InquiryForm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {email} = location.state || {email: 'user@example.com'} // 로그인된 사용자의 이메일을 받음

  const [inquiry, setInquiry] = useState({
    email: email, // 로그인된 사용자 이메일로 설정
    title: '',
    content: ''
  })

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target
    setInquiry(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const inquiryData = {
      email: inquiry.email, // 이메일 데이터 확인
      csTitle: inquiry.title, // 제목 데이터 확인
      csContent: inquiry.content // 내용 데이터 확인
    }

    console.log('Submitting inquiry data:', inquiryData) // 여기서 데이터 확인

    try {
      const response = await fetch('http://localhost:8080/api/customerservice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // 자격 증명 포함
        body: JSON.stringify(inquiryData)
      })

      if (response.ok) {
        alert('문의가 성공적으로 접수되었습니다.')
        navigate('/customerservice/customerservice')
      } else {
        console.error('Error:', await response.text())
        alert('문의 접수에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('서버 오류가 발생했습니다.')
    }
  }

  const handleCancel = () => {
    setInquiry({
      email: email, // 초기 상태로 되돌림
      title: '',
      content: ''
    })
    navigate('/customerservice/customerservice')
  }

  return (
    <div className={inquiryCSS['inquiry-form']}>
      <main className={inquiryCSS.main}>
        <h1 className={inquiryCSS['inquiry-title']}>{'문의하기'}</h1>
        <form onSubmit={handleSubmit} className={inquiryCSS['inquiry-form-content']}>
          <div className={inquiryCSS['form-group']}>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={inquiry.email} // 로그인된 사용자의 이메일이 표시됨
              readOnly
              className={inquiryCSS['readonly-input']}
            />
          </div>
          <div className={inquiryCSS['form-group']}>
            <label>제목</label>
            <input
              type="text"
              name="title"
              value={inquiry.title}
              onChange={handleInputChange}
              className={inquiryCSS['inquiry-titlearea']}
            />
          </div>
          <div className={inquiryCSS['form-group']}>
            <label>내용</label>
            <textarea
              name="content"
              value={inquiry.content}
              onChange={handleInputChange}
              className={inquiryCSS['inquiry-textarea']}
            />
          </div>
          <div className={inquiryCSS['form-actions']}>
            <button type="submit" className={inquiryCSS['submit-btn']}>
              문의하기
            </button>
            <button
              type="button"
              className={inquiryCSS['cancel-btn']}
              onClick={handleCancel}>
              취소하기
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default InquiryForm
