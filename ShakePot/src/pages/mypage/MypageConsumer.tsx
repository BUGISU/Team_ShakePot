import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {FaRegStar} from 'react-icons/fa'
import {useAuth} from '../../routes/AuthContext'
import styles from './MyPageCSS/mypageConsumerCSS.module.css'

interface MyInfoData {
  name: string
  email: string
  gender: string // Gender를 문자열로 반영
  pw: string
}

interface ReviewData {
  rno: number
  rContent: string
  rating: number
  likes: number
  pno: number
}

// 내정보 컴포넌트
const MyInfoPage: React.FC<{userInfo: MyInfoData}> = ({userInfo}) => (
  <div className={styles.infoContainer}>
    <h2 className={styles.title}>내정보</h2>
    <form className={styles.infoForm}>
      <div className={styles.formGroup}>
        <label>이름</label>
        <input type="text" value={userInfo.name} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>아이디</label>
        <input type="text" value={userInfo.email} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>비밀번호</label>
        <input type="password" value={userInfo.pw} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>성별</label>
        <input type="text" value={userInfo.gender} readOnly />
      </div>
    </form>
  </div>
)

// 내정보 수정 컴포넌트
const EditInfoPage: React.FC<{
  userInfo: MyInfoData
  setUserInfo: React.Dispatch<React.SetStateAction<MyInfoData | null>>
}> = ({userInfo, setUserInfo}) => {
  const [editedInfo, setEditedInfo] = useState(userInfo)
  const {uno} = useParams<{uno: string}>() // uno 값을 URL에서 가져옴
  const token = sessionStorage.getItem('token')
  const navigate = useNavigate()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:8080/api/consumer/update/${uno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedInfo)
      })

      if (!response.ok) {
        throw new Error('Failed to update user info')
      }

      setUserInfo(editedInfo) // 수정된 userInfo 반영
      alert('정보가 수정되었습니다.')
      navigate(`/mypage/mypageconsumer/${uno}`)
    } catch (error) {
      console.error('Error updating user data:', error)
      alert('정보 수정에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  return (
    <div className={styles.infoContainer}>
      <h2 className={styles.title}>회원정보 수정 및 삭제</h2>
      <form className={styles.infoForm} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label>이름</label>
          <input
            type="text"
            value={editedInfo.name}
            onChange={e => setEditedInfo({...editedInfo, name: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>아이디(이메일)</label>
          <input type="text" value={editedInfo.email} readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            value={editedInfo.pw}
            onChange={e => setEditedInfo({...editedInfo, pw: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>성별</label>
          <label>
            <input
              type="radio"
              value="MALE"
              checked={editedInfo.gender === 'MALE'}
              onChange={e => setEditedInfo({...editedInfo, gender: e.target.value})}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              value="FEMALE"
              checked={editedInfo.gender === 'FEMALE'}
              onChange={e => setEditedInfo({...editedInfo, gender: e.target.value})}
            />
            여성
          </label>
        </div>
        <button type="submit" className={styles.confirmButton}>
          수정
        </button>
        <button type="button" className={styles.cancelButton}>
          탈퇴
        </button>
      </form>
    </div>
  )
}

// 내가 쓴 리뷰 목록 컴포넌트
const MyReviewListPage: React.FC<{review: ReviewData[]}> = ({review}) => {
  const navigate = useNavigate()

  const handleReviewClick = (pno: number) => {
    navigate(`/detail/${pno}/productInfo`)
  }

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.title}>내가 쓴 한줄평</h2>
      {review.map(review => (
        <div
          key={review.rno}
          className={styles.reviewItem}
          onClick={() => handleReviewClick(review.pno)}>
          <div className={styles.reviewText}>
            <p>내용: {review.rContent}</p>
            <p>
              평점: {'★'.repeat(review.rating)} {'☆'.repeat(5 - review.rating)}
            </p>
            <p>좋아요 수: {review.likes}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// 메인 MyPageConsumer 컴포넌트
const MyPageConsumer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('myInfo')
  const [userInfo, setUserInfo] = useState<MyInfoData | null>(null)
  const [review, setReview] = useState<ReviewData[]>([])
  const {isLoggedIn, email: loggedInUser} = useAuth() // AuthContext에서 로그인 정보 가져옴
  const navigate = useNavigate()
  const token = sessionStorage.getItem('token')
  const {uno} = useParams<{uno: string}>() // uno 값을 URL에서 가져옴
  console.log(uno) // 콘솔에 uno 값을 출력하여 확인

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoggedIn) {
        navigate('/login') // 로그인 상태가 아닐 때 리다이렉트
        return // 함수 종료
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`,
          {
            headers: {Authorization: `Bearer ${token}`} // 토큰을 포함하여 요청
          }
        )

        if (response.ok) {
          const data = await response.json()

          // 소비자 정보 가져오기
          const consumerResponse = await fetch(
            `http://localhost:8080/api/user/user-info?email=${loggedInUser}`,
            {
              headers: {Authorization: `Bearer ${token}`}
            }
          )

          if (consumerResponse.ok) {
            const consumerData = await consumerResponse.json()
            setUserInfo({
              name: consumerData.name,
              email: consumerData.email,
              pw: '*********',
              gender: consumerData.gender
            })

            // 리뷰 가져오기
            const reviewResponse = await fetch(
              `http://localhost:8080/api/consumer/${uno}/review`, // uno 사용
              {
                headers: {Authorization: `Bearer ${token}`}
              }
            )

            if (reviewResponse.ok) {
              const reviewData = await reviewResponse.json()
              setReview(reviewData)
            } else {
              console.error('Failed to fetch review data')
            }
          } else {
            console.error('Failed to fetch consumer info')
          }
        } else {
          console.error('Failed to fetch user info')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        navigate('/login') // 로그인 페이지로 리다이렉트
      }
    }

    fetchUserInfo()
  }, [isLoggedIn, navigate, token, loggedInUser, uno]) // uno도 의존성 배열에 추가

  const renderContent = () => {
    if (!userInfo) return <div>Loading...</div>

    switch (activeTab) {
      case 'myInfo':
        return <MyInfoPage userInfo={userInfo} />
      case 'editInfo':
        return <EditInfoPage userInfo={userInfo} setUserInfo={setUserInfo} />
      case 'myReview':
        return <MyReviewListPage review={review} />
      default:
        return <div>Invalid tab</div>
    }
  }

  return (
    <div className={styles.mypageContainer}>
      <div className={styles.sidebar}>
        <div className={styles.profileHeader}>
          <p className={styles.memberInfo}>{userInfo ? userInfo.name : 'Loading...'}</p>
          <h2 className={styles.myPageTitle}>MyPage</h2>
          <hr />
        </div>
        <div className={styles.tabs}>
          <button
            className={activeTab === 'myInfo' ? styles.active : ''}
            onClick={() => setActiveTab('myInfo')}>
            <FaRegStar /> 내정보
          </button>
          <button
            className={activeTab === 'editInfo' ? styles.active : ''}
            onClick={() => setActiveTab('editInfo')}>
            <FaRegStar /> 정보수정 및 탈퇴
          </button>
          <button
            className={activeTab === 'myReview' ? styles.active : ''}
            onClick={() => setActiveTab('myReview')}>
            <FaRegStar /> 내가 쓴 한줄평
          </button>
        </div>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  )
}

export default MyPageConsumer
