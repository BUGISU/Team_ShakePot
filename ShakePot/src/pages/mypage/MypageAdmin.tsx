import React, {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {FaCog} from 'react-icons/fa'
import styles from './MyPageCSS/mypageCSS.module.css'

// 데이터 타입 정의
interface DataItem {
  id: number
  userId?: string
  name?: string
  email?: string
  group?: string // For user management group (role)
  contentTitle?: string
  contentPrice?: string
  commentContent?: string
  gender?: string // 성별 필드
  businessNumber?: string // 기업을 위한 사업자번호 필드
}

const MyPageAdmin: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 탭, 페이지네이션, 검색 필터, 데이터 상태 관리
  const [activeTab, setActiveTab] = useState<string>('userManagement')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchFilter, setSearchFilter] = useState<string>('회원번호') // 기본 필터
  const [userData, setUserData] = useState<DataItem[]>([])
  const [contentData, setContentData] = useState<DataItem[]>([])
  const [commentData, setCommentData] = useState<DataItem[]>([])

  // 페이지당 아이템 수
  const itemsPerPage: number = 10

  // 가상의 사용자 데이터 생성
  useEffect(() => {
    const userMockData: DataItem[] = new Array(50).fill(null).map((_, index) => ({
      id: index + 1,
      userId: `user${index + 1}`,
      name: `userName ${index + 1}`,
      email: `user${index + 1}@naver.com`,
      group: index % 2 === 0 ? '개인' : '기업',
      gender: index % 2 === 0 ? '남성' : '여성',
      businessNumber: index % 2 === 1 ? `사업자번호-${index + 1}` : '' // 기업인 경우에만 사업자번호 생성
    }))

    const contentDataMock: DataItem[] = new Array(50).fill(null).map((_, index) => ({
      id: index + 1,
      contentTitle: `상품 ${index + 1}`,
      contentPrice: `${(index + 1) * 1000}원`
    }))

    const commentDataMock: DataItem[] = new Array(50).fill(null).map((_, index) => ({
      id: index + 1,
      commentContent: `댓글 내용 ${index + 1}`,
      userId: `userName ${index + 1}`,
      email: `user${index + 1}@naver.com`
    }))

    setUserData(userMockData)
    setContentData(contentDataMock)
    setCommentData(commentDataMock)
  }, [])

  // 수정된 데이터를 반영
  useEffect(() => {
    if (location.state?.updatedData) {
      const updatedUser = location.state.updatedData
      setUserData(prevUserData =>
        prevUserData.map(user => (user.id === updatedUser.id ? updatedUser : user))
      )
    }

    // 삭제된 데이터를 반영
    if (location.state?.deletedId) {
      const deletedId = location.state.deletedId
      setUserData(prevUserData => prevUserData.filter(user => user.userId !== deletedId))
    }
  }, [location.state])

  // 페이지 변경 핸들러
  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
  }

  // 탭 변경 핸들러
  const handleTabChange = (tab: string): void => {
    setActiveTab(tab)
    setCurrentPage(1) // 탭 변경 시 페이지를 1로 초기화
    setSearchFilter(
      tab === 'userManagement'
        ? '회원번호'
        : tab === 'contentManagement'
        ? '제목'
        : '게시글 번호'
    ) // 각 탭에 맞는 검색 필터 설정
  }

  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSearchFilter(e.target.value)
  }

  // **회원 관리 탭에서 정보수정 페이지로 이동하는 함수**
  const navigateToModifyPage = (item: DataItem) => {
    if (item.group === '개인') {
      navigate('/infoModifyConsumer', {state: {userData: item}})
    } else if (item.group === '기업') {
      navigate('/infoModifyCompany', {state: {companyData: item}})
    }
  }

  // **콘텐츠 관리 탭에서 DetailPageAdmin으로 이동하는 함수**
  const navigateToDetailPageAdmin = (id: number) => {
    navigate('/detail/detailpageadmin', {state: {contentId: id}})
  }

  // 댓글 삭제 핸들러
  const handleDeleteClick = (id: number): void => {
    const confirmed = window.confirm('댓글을 삭제하시겠습니까?')
    if (confirmed) {
      setCommentData(prevCommentData =>
        prevCommentData.filter(comment => comment.id !== id)
      )
      console.log(`댓글 ID ${id} 삭제됨`)
    }
  }

  // 검색 필터에 따라 데이터 필터링
  const filteredData = (
    activeTab === 'userManagement'
      ? userData
      : activeTab === 'contentManagement'
      ? contentData
      : commentData
  ).filter(item =>
    activeTab === 'userManagement'
      ? (searchFilter === '회원번호' && item.id.toString().includes(searchQuery)) ||
        (searchFilter === '아이디' &&
          item.userId?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchFilter === '이름' &&
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchFilter === '이메일' &&
          item.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchFilter === '그룹(역할)' &&
          item.group?.toLowerCase().includes(searchQuery.toLowerCase()))
      : activeTab === 'contentManagement'
      ? (searchFilter === '제목' &&
          item.contentTitle?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchFilter === '가격' && item.contentPrice?.includes(searchQuery)) ||
        (searchFilter === '게시글 번호' && item.id.toString().includes(searchQuery))
      : (searchFilter === '게시글 번호' && item.id.toString().includes(searchQuery)) ||
        (searchFilter === '댓글내용' &&
          item.commentContent?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchFilter === '사용자/공급자 ID' &&
          item.userId?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (searchFilter === '이메일' &&
          item.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // 현재 페이지 데이터 가져오기
  const currentPageData: DataItem[] = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className={styles['mypage-container']}>
      {/* 탭 메뉴 */}
      <div className={styles['tabs']}>
        <button
          className={activeTab === 'userManagement' ? styles['active'] : ''}
          onClick={() => handleTabChange('userManagement')}>
          <FaCog />
          회원 관리
        </button>
        <button
          className={activeTab === 'contentManagement' ? styles['active'] : ''}
          onClick={() => handleTabChange('contentManagement')}>
          <FaCog />
          콘텐츠 관리
        </button>
        <button
          className={activeTab === 'commentManagement' ? styles['active'] : ''}
          onClick={() => handleTabChange('commentManagement')}>
          <FaCog />
          전체 댓글 관리
        </button>
      </div>

      {/* 검색 필터 및 입력 */}
      <div className={styles['search-container']}>
        <select
          value={searchFilter}
          onChange={handleFilterChange}
          className={styles['filter-dropdown']}>
          {activeTab === 'userManagement' && (
            <>
              <option value="회원번호">회원번호</option>
              <option value="아이디">아이디</option>
              <option value="이름">이름</option>
              <option value="이메일">이메일</option>
              <option value="그룹(역할)">그룹(역할)</option>
            </>
          )}
          {activeTab === 'contentManagement' && (
            <>
              <option value="제목">제목</option>
              <option value="가격">가격</option>
              <option value="게시글 번호">게시글 번호</option>
            </>
          )}
          {activeTab === 'commentManagement' && (
            <>
              <option value="게시글 번호">게시글 번호</option>
              <option value="댓글내용">댓글내용</option>
              <option value="사용자/공급자 ID">사용자/공급자 ID</option>
              <option value="이메일">이메일</option>
            </>
          )}
        </select>
        <input
          type="text"
          placeholder="검색"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles['search-input']}
        />
        <button className={styles['search-btn']}>🔍</button>
      </div>

      {/* 테이블 */}
      <div className={styles['table-container']}>
        <table className={styles['data-table']}>
          <thead>
            <tr>
              <th>번호</th>
              <th style={activeTab === 'contentManagement' ? {width: '40%'} : {}}>
                {activeTab === 'userManagement'
                  ? '아이디'
                  : activeTab === 'contentManagement'
                  ? '제목'
                  : '댓글 내용'}
              </th>
              <th>
                {activeTab === 'userManagement'
                  ? '이름'
                  : activeTab === 'contentManagement'
                  ? '가격'
                  : '사용자/공급자 ID'}
              </th>
              <th>
                {activeTab === 'userManagement'
                  ? '이메일'
                  : activeTab === 'contentManagement'
                  ? ''
                  : '이메일'}
              </th>
              {activeTab === 'userManagement' && <th>그룹(역할)</th>}
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {activeTab === 'userManagement'
                      ? item.userId
                      : activeTab === 'contentManagement'
                      ? item.contentTitle
                      : item.commentContent}
                  </td>
                  <td>
                    {activeTab === 'userManagement'
                      ? item.name
                      : activeTab === 'contentManagement'
                      ? item.contentPrice
                      : item.userId}
                  </td>
                  <td>
                    {activeTab === 'userManagement'
                      ? item.email
                      : activeTab === 'contentManagement'
                      ? ''
                      : item.email}
                  </td>
                  {activeTab === 'userManagement' && <td>{item.group}</td>}
                  <td>
                    {activeTab === 'commentManagement' ? (
                      <button
                        className={styles['edit-button']}
                        onClick={() => handleDeleteClick(item.id)}>
                        댓글 삭제
                      </button>
                    ) : activeTab === 'contentManagement' ? (
                      <button
                        className={styles['edit-button']}
                        onClick={() => navigateToDetailPageAdmin(item.id)}>
                        정보수정
                      </button>
                    ) : (
                      <button
                        className={styles['edit-button']}
                        onClick={() => navigateToModifyPage(item)}>
                        정보수정
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className={styles['pagination']}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from(
          {length: Math.ceil(filteredData.length / itemsPerPage)},
          (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? styles['active'] : ''}>
              {index + 1}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default MyPageAdmin
