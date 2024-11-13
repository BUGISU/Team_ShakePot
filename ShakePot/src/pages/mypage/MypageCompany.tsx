import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {FaRegStar} from 'react-icons/fa'
import {useAuth} from '../../routes/AuthContext'
import styles from './MyPageCSS/mypageCompanyCSS.module.css'

interface MyInfoData {
  name: string
  pw: string
  email: string
  cName: string
  mainProduct: string
  cNumber: string
  gender: string
  userType: '기업회원' | '소비자' | '관리자' // 다른 사용자 타입도 추가
}

interface ProductData {
  pno: number
  pName: string
  taste: string
  imageUrl: string
}

const MyInfoPage: React.FC<{userInfo: MyInfoData}> = ({userInfo}) => (
  <div className={styles.infoContainer}>
    <h2 className={styles.title}>내정보</h2>
    <form className={styles.infoForm}>
      <div className={styles.formGroup}>
        <label>이름</label>
        <input type="text" value={userInfo.name || ''} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>아이디(이메일)</label>
        <input type="text" value={userInfo.email || ''} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>비밀번호</label>
        <input type="password" value={userInfo.pw || ''} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>회사명</label>
        <input type="text" value={userInfo.cName || ''} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>대표제품</label>
        <input type="text" value={userInfo.mainProduct || ''} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>사업자번호</label>
        <input type="text" value={userInfo.cNumber || ''} readOnly />
      </div>
      <div className={styles.formGroup}>
        <label>성별</label>
        <input type="text" value={userInfo.gender || ''} readOnly />
      </div>
    </form>
  </div>
)

const EditInfoPage: React.FC<{
  userInfo: MyInfoData
  setUserInfo: React.Dispatch<React.SetStateAction<MyInfoData>>
}> = ({userInfo, setUserInfo}) => {
  const [editedInfo, setEditedInfo] = useState(userInfo)
  const {uno} = useParams<{uno: string}>()
  const token = sessionStorage.getItem('token')
  const navigate = useNavigate()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:8080/api/company/update/${uno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedInfo)
      })

      if (!response.ok) throw new Error('Failed to update company info')

      setUserInfo(editedInfo)
      alert('정보가 수정되었습니다.')
      navigate(`/mypage/mypagecompany/${uno}`)
    } catch (error) {
      console.error('Error updating company data:', error)
      alert('정보 수정에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  return (
    <div className={styles.infoContainer}>
      <h2 className={styles.title}>회원정보 수정</h2>
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
          <label>회사명</label>
          <input
            type="text"
            value={editedInfo.cName}
            onChange={e => setEditedInfo({...editedInfo, cName: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>대표제품</label>
          <input
            type="text"
            value={editedInfo.mainProduct}
            onChange={e => setEditedInfo({...editedInfo, mainProduct: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>사업자번호</label>
          <input
            type="text"
            value={editedInfo.cNumber}
            onChange={e => setEditedInfo({...editedInfo, cNumber: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>성별</label>
          <input
            type="radio"
            value="남성"
            checked={editedInfo.gender === '남성'}
            onChange={() => setEditedInfo({...editedInfo, gender: '남성'})}
          />{' '}
          남성
          <input
            type="radio"
            value="여성"
            checked={editedInfo.gender === '여성'}
            onChange={() => setEditedInfo({...editedInfo, gender: '여성'})}
          />{' '}
          여성
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

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([])
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/company/products`, {
          headers: {Authorization: `Bearer ${token}`}
        })
        if (response.ok) {
          const productData = await response.json()
          setProducts(productData)
        } else {
          console.error('Failed to fetch product data')
        }
      } catch (error) {
        console.error('Error fetching product data:', error)
      }
    }

    fetchProducts()
  }, [token])

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.title}>내 제품 목록</h2>
      {products.map(product => (
        <div key={product.pno} className={styles.reviewItem}>
          <h3>{product.pName}</h3>
          <p>맛: {product.taste}</p>
          <img
            src={product.imageUrl}
            alt={product.pName}
            className={styles.productImage}
          />
        </div>
      ))}
    </div>
  )
}

const MyPageCompany: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('myInfo')
  const [userInfo, setUserInfo] = useState<MyInfoData | null>(null)
  const {isLoggedIn, email: loggedInUser} = useAuth()
  const navigate = useNavigate()
  const token = sessionStorage.getItem('token')
  const {uno} = useParams<{uno: string}>()

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoggedIn) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`,
          {
            headers: {Authorization: `Bearer ${token}`}
          }
        )

        if (response.ok) {
          const data = await response.json()
          setUserInfo({
            name: data.name,
            email: data.email,
            pw: '*********',
            cName: data.cName,
            mainProduct: data.mainProduct,
            cNumber: data.cNumber,
            gender: data.gender,
            userType: data.userType
          })
        } else {
          console.error('Failed to fetch company info')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        navigate('/login')
      }
    }

    fetchUserInfo()
  }, [isLoggedIn, navigate, token, loggedInUser, uno])

  const renderContent = () => {
    if (!userInfo) return <div>Loading...</div>

    switch (activeTab) {
      case 'myInfo':
        return <MyInfoPage userInfo={userInfo} />
      case 'editInfo':
        return <EditInfoPage userInfo={userInfo} setUserInfo={setUserInfo} />
      case 'myProducts':
        return <ProductListPage />
      default:
        return <MyInfoPage userInfo={userInfo} />
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
            <FaRegStar /> 정보수정
          </button>
          <button
            className={activeTab === 'myProducts' ? styles.active : ''}
            onClick={() => setActiveTab('myProducts')}>
            <FaRegStar /> 내 제품 목록
          </button>
        </div>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  )
}

export default MyPageCompany
