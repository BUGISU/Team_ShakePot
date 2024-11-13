import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import detailCSS from './detailCSS/detailCSS.module.css'
import ProductDetail from './ProductDetail'
import NutritionTable from './NutritionTable'
import ProductReview from './ProductReview'
import Comments from './Comments'
import Tabs from './Tabs'

// Product 정보 인터페이스
interface ProductInfoProps {
  pno: number
  uno: number
  email: string
  pName: string
  price: number
  rank: number
  link: string
  rating: number
  reviews: number
  nutritionInfo: NutritionInfo // 영양 성분 정보 추가
}

// 영양 성분 인터페이스
interface NutritionInfo {
  carbohydrate: number
  sugar: number
  protein: number
  fat: number
  transFat: number
  saturatedFat: number
  cholesterol: number
  sodium: number
  calorie: number
}

// Review 인터페이스
interface Review {
  id: number
  userName: string
  content: string
  rating: number
  date: string
  imageUrl: string
}

// Comment 인터페이스
interface Comment {
  rno: number
  consuemr_id: number
  fno: number
  pno: number
  rcontent: string
  rating: number
  likes: number
  profileImage: string
  regDate: string
}

// 초기 제품 상태
const initialProductState: ProductInfoProps = {
  pno: 0,
  pName: '',
  price: 0,
  uno: 0,
  email: '',
  rank: 0,
  link: '',
  rating: 0,
  reviews: 0,
  nutritionInfo: {
    carbohydrate: 0,
    sugar: 0,
    protein: 0,
    fat: 0,
    transFat: 0,
    saturatedFat: 0,
    cholesterol: 0,
    sodium: 0,
    calorie: 0
  }
}

// 리뷰 데이터
const reviewsData: Review[] = [
  {
    id: 1,
    userName: '맛집탐방러',
    content: '초코맛은 벌써 다 먹었네! 식감이 있어서 안질려요',
    rating: 5,
    date: '2024-09-01',
    imageUrl: 'https://via.placeholder.com/50'
  },
  {
    id: 2,
    userName: '운동하는직장인',
    content: '하도 맛있어서 주문! 아침 저녁 대용으로 열심히 먹고있어요ㅋㅋㅋ',
    rating: 5,
    date: '2024-08-30',
    imageUrl: 'https://via.placeholder.com/50'
  },
  {
    id: 3,
    userName: '건강한아침',
    content: '아침밥 대신 먹는 "코코밥" 초코맛',
    rating: 4,
    date: '2024-08-25',
    imageUrl: 'https://via.placeholder.com/50'
  },
  {
    id: 4,
    userName: '단백질충전러',
    content: '후기: 처음으로 구매해본 단백질 쉐이크, 올리마켓 코코밥 초코맛',
    rating: 5,
    date: '2024-08-20',
    imageUrl: 'https://via.placeholder.com/50'
  },
  {
    id: 5,
    userName: '초코덕후',
    content: '초코 우유맛 나는 밥 같아서 맛있어요',
    rating: 5,
    date: '2024-08-18',
    imageUrl: 'https://via.placeholder.com/50'
  },
  {
    id: 6,
    userName: '헬스매니아',
    content: '올리마켓 코코밥 초코 내돈내산 솔직 후기',
    rating: 4,
    date: '2024-08-15',
    imageUrl: 'https://via.placeholder.com/50'
  }
]

const DetailPage = ({defaultTab = 'productInfo'}) => {
  const {fno} = useParams<{fno: string}>()
  // const pno = '93' // 테스트를 위한 임시 값
  const {pno} = useParams<{pno: string}>()
  console.log('fno:', fno, 'pno:', pno)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isEditing, setIsEditing] = useState(false)
  const [product, setProduct] = useState<ProductInfoProps>(initialProductState)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const reviewsPerPage = 5
  const commentsPerPage = 10

  // 데이터를 가져와서 comments 형식에 맞게 매핑
  // 데이터를 가져와서 comments 형식에 맞게 매핑
  const fetchProductData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/feed/read/${fno}`)
      if (!response.ok) throw new Error('Failed to fetch feed data')
      const data = await response.json()
      setProduct(data.productDTO)
    } catch (error) {
      console.error('Feed data fetch error:', error)
    }
  }

  const fetchReviewData = async () => {
    try {
      if (!pno) return // pno가 없는 경우 바로 종료
      const reviewResponse = await fetch(
        `http://localhost:8080/api/review/product/${pno}`
      )
      if (!reviewResponse.ok) throw new Error('Failed to fetch review data')
      const reviewData = await reviewResponse.json()
      setComments(
        reviewData.map((review: any) => ({
          rno: review.rno,
          consumer_id: review.consumer_id,
          fno: review.fno,
          pno: review.pno,
          rContent: review.rContent,
          rating: review.rating,
          likes: review.likes || 0,
          profileImage: review.imageUrl || 'https://via.placeholder.com/50',
          email: review.email,
          regDate: review.regDate
        }))
      )
    } catch (error) {
      console.error('Review data fetch error:', error)
    }
  }

  useEffect(() => {
    if (fno) fetchProductData()
    if (pno) fetchReviewData()
  }, [fno, pno])

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    navigate(`/detail/${fno}/${newTab}`)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleEdit = () => setIsEditing(true)
  const handleSaveEdit = () => setIsEditing(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setProduct(prevProduct => ({...prevProduct, [name]: value}))
  }

  return (
    <div className={detailCSS.productPage}>
      <hr className={detailCSS.divider} />
      <ProductDetail
        product={product}
        isEditing={isEditing}
        setEditing={setIsEditing} // setIsEditing을 setEditing으로 전달
        handleInputChange={handleInputChange}
        handleEdit={handleEdit}
      />
      <hr className={detailCSS.divider} />
      <Tabs activeTab={activeTab} handleTabChange={handleTabChange} />
      <hr className={detailCSS.divider} />

      {activeTab === 'productInfo' && (
        <NutritionTable
          product={product}
          setProduct={setProduct}
          handleInputChange={handleInputChange}
        />
      )}

      {activeTab === 'productReview' && (
        <ProductReview
          reviews={reviewsData} // 여기에 reviewsData 전달
          currentPage={currentPage}
          reviewsPerPage={reviewsPerPage}
          paginate={paginate}
        />
      )}

      {activeTab === 'comments' && (
        <Comments
          comments={comments}
          currentPage={currentPage}
          commentsPerPage={commentsPerPage}
          paginate={paginate}
          fetchReviewData={fetchReviewData} // fetchReviewData 전달
          pno={product.pno} // pno 전달
        />
      )}
    </div>
  )
}

export default DetailPage
