import React, {useEffect, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import fontStyles from '../../components/font.module.css'
import categoryCSS from './CSS/CategoryCSS.module.css'
import {useAuth} from '../../routes/AuthContext'
import CategoryDropdown from '../../components/CategoryDropdown'
import searchBtn from '../../img/Search.png'

const TastePage: React.FC = () => {
  const [feed, setFeed] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const {isLoggedIn, email: loggedInUser} = useAuth()
  const [userType, setUserType] = useState<string>('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const [selectedCategory, setSelectedCategory] = useState('판매량')

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLoggedIn && loggedInUser) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
          )
          if (response.ok) {
            const data = await response.json()
            setUserType(data.userType)
          } else {
            console.error('Failed to fetch user info')
          }
        } catch (error) {
          console.error('Fetch error:', error)
        }
      }
    }

    fetchUserInfo()
  }, [isLoggedIn, loggedInUser])

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
    판매량: 'salesVolume',
    초코맛: 'chocolate',
    과일맛: 'fruit',
    쿠키앤크림맛: 'cookiesAndCream',
    말차맛: 'matcha',
    곡물맛: 'grain',
    기타: 'other'
  }

  useEffect(() => {
    const category =
      selectedCategory === '판매량'
        ? 'salesVolume'
        : categoryMapping[selectedCategory] || 'TASTE'

    let url = `http://localhost:8080/api/feed/filter/taste?category=${category}&page=${currentPage}`

    if (selectedCategory === '판매량') {
      url = `http://localhost:8080/api/feed/filter/taste?category=salesVolume&page=${currentPage}`
    } else if (categoryMapping[selectedCategory]) {
      url = `http://localhost:8080/api/feed/filter/taste?category=TASTE&tasteList=${encodeURIComponent(
        categoryMapping[selectedCategory]
      )}&page=${currentPage}`
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        if (response.ok) {
          setFeed(data.pageResultDTO.dtoList || [])
          setTotalPages(data.pageResultDTO.totalPage || 0)
        } else {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()
  }, [currentPage, selectedCategory])

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
      category: searchParams.get('category') || 'TASTE',
      page: pageNumber.toString()
    })
  }

  const tasteCategories = [
    '판매량',
    '초코맛',
    '과일맛',
    '쿠키앤크림맛',
    '말차맛',
    '곡물맛',
    '기타'
  ]

  // 페이지 버튼 최대 10개씩만 표시
  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1
  const endPage = Math.min(startPage + 9, totalPages)

  return (
    <div className={categoryCSS.app}>
      <section className={categoryCSS.hero}>
        <h1 className={fontStyles['knewave-regular']}>Taste</h1>
      </section>
      <div className={categoryCSS['categoryItem']}>
        <div className={categoryCSS['search-bar']}>
          <CategoryDropdown
            categories={tasteCategories}
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
          {feed.map(feed => (
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
            key={index}
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

export default TastePage
