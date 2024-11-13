import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../routes/AuthContext'
import customerserviceCSS from './customerServiceCSS/customerserviceCSS.module.css'
import fontStyles from '../../components/font.module.css'

const CustomerService: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1) // 현재 페이지 상태
  const [searchTerm, setSearchTerm] = useState<string>('') // 검색어 상태
  const [questions, setQuestions] = useState<any[]>([]) // 초기 상태를 빈 배열로 설정
  const [userUno, setUserUno] = useState<string>('') // 사용자 유형
  const [userType, setUserType] = useState<string>('') // 사용자 유형
  const {isLoggedIn, email: loggedInUser} = useAuth() // AuthContext에서 로그인 정보 가져옴
  const navigate = useNavigate() // 페이지 이동을 위한 useNavigate

  const questionsPerPage = 10
  const pagesPerGroup = 5 // 한 그룹당 표시할 페이지 수
  const [currentGroup, setCurrentGroup] = useState<number>(1) // 현재 페이지 그룹

  // 사용자 유형에 따른 분기
  const isAdmin = userType === 'ADMIN'
  const isConsumer = userType === 'CONSUMER'
  const isCompany = userType === 'COMPANY'
  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log('loggedInUser', loggedInUser)
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
        )
        if (response.ok) {
          const data = await response.json()
          setUserUno(data.uno) // uno 값 설정
          setUserType(data.userType) // dtype 값 설정
          console.log('data', data)
          console.log('data.userType', data.userType)
        } else {
          console.error('Failed to fetch user info')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    if (isLoggedIn && loggedInUser) {
      fetchUserInfo() // 로그인된 경우에만 사용자 정보를 가져옴
    }
  }, [isLoggedIn, loggedInUser])

  // API로부터 데이터를 가져오는 함수
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/customerservice/all')
        if (response.ok) {
          const data = await response.json()
          const initialQuestions = data.map((item: any) => ({
            csno: item.csno,
            csTitle: item.csTitle,
            csContent: item.csContent,
            email: item.email,
            date: item.regDate
          }))
          setQuestions(initialQuestions)
        } else {
          throw new Error('Failed to fetch questions')
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }
    fetchQuestions()
  }, [])

  // 필터된 질문 목록 계산
  const filteredQuestions = questions.filter(
    question =>
      question.csTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.date.includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage) // 필터링된 데이터에 따른 전체 페이지 수

  // 페이지 그룹의 시작 페이지 번호 계산
  const getStartPageOfGroup = () => (currentGroup - 1) * pagesPerGroup + 1

  // 페이지 그룹의 끝 페이지 번호 계산
  const getEndPageOfGroup = () => Math.min(currentGroup * pagesPerGroup, totalPages)

  // 다음 페이지 그룹으로 이동
  const nextGroup = () => {
    if (currentGroup * pagesPerGroup < totalPages) {
      setCurrentGroup(currentGroup + 1)
      setCurrentPage(getStartPageOfGroup() + pagesPerGroup)
    }
  }

  // 이전 페이지 그룹으로 이동
  const prevGroup = () => {
    if (currentGroup > 1) {
      setCurrentGroup(currentGroup - 1)
      setCurrentPage(getStartPageOfGroup() - pagesPerGroup)
    }
  }

  // 현재 페이지에 해당하는 문의들만 표시
  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  )

  const addInquiry = async () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.')
      navigate('/login') // 로그인 페이지로 이동
    } else {
      // 로그인된 사용자 이메일을 가져가서 문의 페이지로 이동
      navigate('/customerservice/inquiryform', {state: {email: loggedInUser}})
    }
  }

  // 검색 시 첫 번째 페이지로 이동
  const handleSearch = () => {
    setCurrentPage(1)
    setCurrentGroup(1)
  }

  // 관리자인지 여부 및 작성자인지에 따라 상세 페이지로 이동
  // 관리자인지 여부 및 작성자인지에 따라 상세 페이지로 이동
  const handleEditClick = question => {
    if (isAdmin) {
      navigate(`/customerservice/inquirydetailconsumer/${question.csno}`)
    } else if (isConsumer || isCompany) {
      if (loggedInUser === question.email) {
        navigate(`/customerservice/inquirydetailconsumer/${question.csno}`)
      } else {
        alert('해당 페이지에 접근할 수 없습니다.')
      }
    } else {
      alert('유효하지 않은 사용자 유형입니다.')
    }
  }

  return (
    <div className={customerserviceCSS['customer-service']}>
      <main>
        <h1
          className={`${customerserviceCSS['qa-title']} ${fontStyles['castoro-regular']}`}>
          Q & A
        </h1>
        <h3 className={customerserviceCSS['qa-subtitle']}>
          ShakePot에게 무엇이든 물어보세요.
        </h3>
        <div className={customerserviceCSS['custommerService-item']}>
          <div className={customerserviceCSS['search-and-add-container']}>
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={customerserviceCSS['search-input']}
            />
            <button
              onClick={handleSearch}
              className={customerserviceCSS['search-button']}>
              검색
            </button>
            <button
              onClick={() => addInquiry()}
              className={customerserviceCSS['new-question-btn']}>
              문의
            </button>
          </div>

          <div>
            {/* <h2>{loggedInUser}의 문의내역</h2> */}
            <table className={customerserviceCSS['qa-table']}>
              <thead>
                <tr>
                  <th>문의내역</th>
                  <th>메일주소</th>
                  <th>날짜</th>
                  {isLoggedIn && <th>상세보기</th>}
                </tr>
              </thead>
              <tbody>
                {currentQuestions.map(question => (
                  <tr key={question.csno}>
                    <td>{question.csTitle}</td>
                    <td>{question.email}</td>
                    <td>{question.date}</td>
                    {isLoggedIn && (
                      <td>
                        {isAdmin || loggedInUser === question.email ? (
                          <button
                            onClick={() => handleEditClick(question)}
                            className={customerserviceCSS['edit-button']}>
                            상세보기
                          </button>
                        ) : (
                          <span></span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className={customerserviceCSS.pagination}>
            <button
              onClick={prevGroup}
              disabled={currentGroup === 1}
              className={customerserviceCSS['pagination-btn']}>
              이전
            </button>
            {Array.from(
              {length: getEndPageOfGroup() - getStartPageOfGroup() + 1},
              (_, i) => (
                <button
                  key={getStartPageOfGroup() + i}
                  onClick={() => setCurrentPage(getStartPageOfGroup() + i)}
                  className={
                    currentPage === getStartPageOfGroup() + i
                      ? customerserviceCSS['pagination-btn-active']
                      : customerserviceCSS['pagination-btn']
                  }>
                  {getStartPageOfGroup() + i}
                </button>
              )
            )}
            <button
              onClick={nextGroup}
              disabled={currentGroup * pagesPerGroup >= totalPages}
              className={customerserviceCSS['pagination-btn']}>
              다음
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CustomerService
