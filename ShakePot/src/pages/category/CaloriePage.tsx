import React, {useEffect, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import fontStyles from '../../components/font.module.css'
import categoryCSS from './CSS/CategoryCSS.module.css'
import {useAuth} from '../../routes/AuthContext'
import CategoryDropdown from '../../components/CategoryDropdown'
import searchBtn from '../../img/Search.png'

const CaloriePage: React.FC = () => {
  const [feed, setFeed] = useState([])
  const itemsPerPage = 6
  const [totalPages, setTotalPages] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [userType, setUserType] = useState<string>('')
  const {isLoggedIn, email: loggedInUser} = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const [selectedCategory, setSelectedCategory] = useState('추천순') // 기본값을 "-"로 설정

  const randomUrls = [
    'https://shopping-phinf.pstatic.net/main_8613578/86135785365.2.jpg?type=f300',
    'https://search.pstatic.net/sunny/?src=https%3A%2F%2Fcdn.011st.com%2F11dims%2Fresize%2F600x600%2Fquality%2F75%2F11src%2Fproduct%2F5974200764%2FB.jpg%3F710000000&type=sc960_832',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240202_256%2F1706838624534FGCS6_PNG%2F34141308361558938_621791600.png&type=sc960_832',
    'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240130_285%2F1706600066081zCVyy_JPEG%2F107735964784530299_267942675.jpg&type=sc960_832',
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fshop-phinf.pstatic.net%2F20241005_90%2F1728100569779sQe02_JPEG%2F8049334426967040_873628570.jpeg&type=sc960_832',
    'https://shopping-phinf.pstatic.net/main_8720276/87202769140.jpg?type=f300'
  ]
  let urlIndex = 0 // URL 배열의 시작 인덱스
  const getSequentialUrl = () => {
    const url = randomUrls[urlIndex]
    urlIndex = (urlIndex + 1) % randomUrls.length // 다음 인덱스로 이동, 끝에 도달하면 다시 0으로
    return url
  }
  const categoryMapping = {
    추천순: 'recommended',
    판매량: 'salesVolume',
    '열량 200g 이상': 'caloriesOver200g',
    '열량 180-199g': 'calories180To199g',
    '열량 150~179g': 'calories150To179g',
    '열량 150g 이하': 'caloriesUnder150g'
  }
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
        )
        if (response.ok) {
          const data = await response.json()
          setUserType(data.userType)
        } else {
          throw new Error('Failed to fetch user info')
        }
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    if (isLoggedIn && loggedInUser) {
      fetchUserInfo()
    }
  }, [isLoggedIn, loggedInUser])

  useEffect(() => {
    const category =
      selectedCategory === '추천순'
        ? 'CALORIE'
        : categoryMapping[selectedCategory] || 'CALORIE'
    let url = `http://localhost:8080/api/feed/filter/calorie?category=${category}&page=${currentPage}`

    // 선택된 카테고리 필터에 따른 URL 구성
    if (selectedCategory === '추천순') {
      url = `http://localhost:8080/api/feed/filter/calorie?category=${category}&page=${currentPage}`
    } else if (selectedCategory === '판매량') {
      url = `http://localhost:8080/api/feed/filter/calorie?category=${category}&page=${currentPage}`
    } else if (selectedCategory === '열량 200g 이상') {
      url = `http://localhost:8080/api/feed/filter/calorie?minCalorie=200&page=${currentPage}`
    } else if (selectedCategory === '열량 180-199g') {
      url = `http://localhost:8080/api/feed/filter/calorie?minCalorie=180&maxCalorie=199&page=${currentPage}`
    } else if (selectedCategory === '열량 150~179g') {
      url = `http://localhost:8080/api/feed/filter/calorie?minCalorie=150&maxCalorie=179&page=${currentPage}`
    } else if (selectedCategory === '열량 150g 이하') {
      url = `http://localhost:8080/api/feed/filter/calorie?minCalorie=0&maxCalorie=150&page=${currentPage}`
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        if (response.ok) {
          setFeed(data.pageResultDTO?.dtoList || [])
          setTotalPages(data.pageResultDTO?.totalPage || 0) // totalPages 업데이트
        } else {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()
  }, [currentPage, selectedCategory])
  // 서버에서 모든 데이터를 가져온 후 클라이언트에서 필터링
  const filteredFeed = feed.filter(item =>
    item.fname.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleCategoryChange = newCategory => {
    setSelectedCategory(newCategory)
    setSearchParams({category: categoryMapping[newCategory] || '', page: '1'})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearch = () => {
    navigate(`?category=${encodeURIComponent(inputValue)}&page=1`)
  }

  const handleFeedClick = (fno: number) => {
    navigate(`/detail/${fno}/productInfo`)
  }

  const handleClick = (pageNumber: number) => {
    setSearchParams({
      category: searchParams.get('category') || 'CALORIE',
      page: pageNumber.toString()
    })
  }

  const calorieCategories = [
    '추천순',
    '판매량',
    '열량 200g 이상',
    '열량 180-199g',
    '열량 150~179g',
    '열량 150g 이하'
  ]

  // 페이지 버튼 최대 10개만 표시
  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1
  const endPage = Math.min(startPage + 9, totalPages)

  return (
    <div className={categoryCSS.app}>
      <section className={categoryCSS.hero}>
        <h1 className={fontStyles['knewave-regular']}>Calorie</h1>
      </section>
      <div className={categoryCSS['categoryItem']}>
        <div className={categoryCSS['search-bar']}>
          <CategoryDropdown
            categories={calorieCategories}
            onChange={handleCategoryChange}
          />
          <input
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button className={categoryCSS['search-btn']} onClick={handleSearch}>
            <img src={searchBtn} alt={'검색'} />
          </button>
          {userType === 'ADMIN' && (
            <button
              className={categoryCSS['register-new-product']}
              onClick={() => navigate('/detail/newproduct')}>
              Register New Product
            </button>
          )}
        </div>
        <section className={categoryCSS['feed-list']}>
          {filteredFeed.map(feed => (
            <button
              key={feed.fno}
              className={categoryCSS['feed-card']}
              onClick={() => handleFeedClick(feed.fno)}>
              <img src={feed.imgSrc || getSequentialUrl()} alt={feed.fname} />
              <h3>{feed.fname}</h3>
              <p>{feed.fprice.toLocaleString()}원</p>
            </button>
          ))}
        </section>
      </div>

      <div className={categoryCSS.pagination}>
        <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage <= 1}>
          Previous
        </button>
        {[...Array(endPage - startPage + 1)].map((_, index) => (
          <button
            key={startPage + index} // startPage와 index 조합으로 키를 설정
            onClick={() => handleClick(startPage + index)}
            className={currentPage === startPage + index ? categoryCSS.active : ''}>
            {startPage + index}
          </button>
        ))}
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>
    </div>
  )
}

export default CaloriePage
