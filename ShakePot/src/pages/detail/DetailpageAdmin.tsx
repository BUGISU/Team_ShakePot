import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext' // AuthContext를 가져옴
import detailCSS from './detailCSS/detailCSS.module.css' // 스타일 적용 확인

// Product 정보 인터페이스
interface ProductInfoProps {
  pno: number
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
  uno: number
  email: string
  pno: number
  rcontent: string
  rating: number
  likes: number
  profileImage: string
  date: string
}

// 제품 데이터
const initialProductState: ProductInfoProps = {
  pno: 0,
  pName: '',
  price: 0,
  rank: 0,
  link: '',
  rating: 0,
  reviews: 0,
  nutritionInfo: {
    calorie: 0,
    carbohydrate: 0,
    sugar: 0,
    protein: 0,
    fat: 0,
    transFat: 0,
    saturatedFat: 0,
    cholesterol: 0,
    sodium: 0
  }
}

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

// 관리자 전용 DetailPage
const DetailPageAdmin = ({defaultTab = 'productInfo'}) => {
  const [activeTab, setActiveTab] = useState<string>('productInfo') // 현재 활성화된 탭 상태
  const {id} = useParams()
  const {pno} = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductInfoProps>(initialProductState) // 제품 데이터 상태
  const [reviews, setReviews] = useState<Review[]>([]) // 리뷰 데이터 상태
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null) // 수정 중인 리뷰 ID 상태
  const [comments, setComments] = useState<Comment[]>([]) // 댓글 데이터 상태

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null) // 수정 중인 댓글 ID 상태
  const [newCommentContent, setNewCommentContent] = useState<string>('') // 새 댓글 내용
  const [editingProductFields, setEditingProductFields] = useState<boolean>(false) // 제품정보 수정 여부
  const [editingNutritionFields, setEditingNutritionFields] = useState<boolean>(false) // 영양성분 수정 여부
  const [editingProductImage, setEditingProductImage] = useState<boolean>(false) // 제품 이미지 수정 상태
  const [editingNutritionImage, setEditingNutritionImage] = useState<boolean>(false) // 영양성분 이미지 수정 상태
  const [productImage, setProductImage] = useState<string | null>(null) // 제품 이미지 상태
  const [nutritionImage, setNutritionImage] = useState<string | null>(null) // 영양 성분 이미지 상태

  const [currentPage, setCurrentPage] = useState<number>(1) // 현재 페이지 상태
  const [currentReviewPage, setCurrentReviewPage] = useState<number>(1) // 리뷰 페이지 상태
  const [currentCommentPage, setCurrentCommentPage] = useState<number>(1) // 한줄평 페이지 상태

  const {loggedUser} = useAuth()

  const reviewsPerPage: number = 5 // 페이지당 리뷰 수
  const commentsPerPage: number = 10 // 페이지당 댓글 수

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const {fno} = useParams()
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/product/${fno}`)
        if (!response.ok) {
          throw new Error('Product fetch failed')
        }
        const data = await response.json()
        console.log(data) // API로부터 받은 데이터 확인
        setProduct({
          pno: data.pno || 0,
          pName: data.pName || '',
          price: data.price || 0,
          rank: data.rank || 2,
          link: `http://smartstore.naver.com/life_b/products/8591286042` || '',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          carbohydrate: data.carbohydrate || 0,
          sugar: data.sugar || 0,
          protein: data.protein || 0,
          fat: data.fat || 0,
          transFat: data.transFat || 0,
          saturatedFat: data.saturated_fat || 0, // API 응답 이름 맞추기
          cholesterol: data.cholesterol || 0,
          sodium: data.sodium || 0,
          calorie: data.calorie || 0
        })
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchProduct()
  }, [fno]) // id가 변경될 때마다 함수 실행

  // API에서 리뷰 데이터를 불러와서 댓글로 사용하는 함수
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/review/product/${fno}`) // 수정필요
        if (!response.ok) throw new Error('Failed to fetch reviews')
        const review = await response.json()
        const transformedComments: Comment[] = review.map((review: any) => ({
          rno: review.rno,
          uno: review.uno, // 유저 번호를 유저 이름으로 대체하는 로직 필요
          email: review.email,
          pno: review.pno,
          rcontent: review.rcontent,
          rating: review.rating,
          likes: review.likes,
          profileImage: 'https://via.placeholder.com/50', // Placeholder for missing image URLs
          date: new Date(review.regDate).toLocaleDateString() // Formatting the date
        }))
        setComments(transformedComments)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchComments()
  }, [fno]) // ID가 변경되면 리뷰 다시 불러오기

  // 사용자가 관리자 또는 해당 리소스의 소유자인지 확인하는 함수
  const canEdit = (email: string) =>
    loggedUser && (loggedUser.email === email || loggedUser.role === 'admin')

  // Tab 전환 핸들러
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    navigate(`/detail/${fno}/${newTab}`) // URL을 새 탭에 맞게 변경
  }

  // 제품 정보 필드별 수정 핸들러
  const handleProductFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProductInfoProps
  ) => {
    setProduct({...product, [field]: e.target.value})
  }

  // 숫자 필드 핸들러 (영양 성분 수정할 때 숫자만 받도록 처리)
  const handleNumericFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NutritionInfo
  ) => {
    setProduct({
      ...product,
      nutritionInfo: {...product.nutritionInfo, [field]: parseFloat(e.target.value)}
    })
  }

  // 제품 이미지 업로드 핸들러
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => setProductImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // 영양 성분 이미지 업로드 핸들러
  const handleNutritionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => setNutritionImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // 저장 및 취소 핸들러
  const saveProductChanges = () => {
    setEditingProductFields(false)
    setEditingProductImage(false)
    alert('제품 정보가 저장되었습니다.')
  }

  const saveNutritionChanges = () => {
    setEditingNutritionFields(false)
    setEditingNutritionImage(false)
    alert('영양 정보가 저장되었습니다.')
  }

  const cancelProductChanges = () => {
    setEditingProductFields(false)
    setEditingProductImage(false)
    alert('제품 정보 수정이 취소되었습니다.')
  }

  const cancelNutritionChanges = () => {
    setEditingNutritionFields(false)
    setEditingNutritionImage(false)
    alert('영양 정보 수정이 취소되었습니다.')
  }

  // 리뷰 수정 핸들러
  const handleReviewEditClick = (reviewId: number) => setEditingReviewId(reviewId)

  const handleReviewSaveClick = (reviewId: number) => {
    setEditingReviewId(null) // 수정 상태 해제
    alert('리뷰가 수정되었습니다.')
  }

  const handleReviewInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>, // 여기에 타입을 명시
    reviewId: number,
    field: keyof Review
  ) => {
    setReviews(
      reviews.map(review =>
        review.id === reviewId ? {...review, [field]: e.target.value} : review
      )
    )
  }

  // 한줄평 수정 핸들러
  const handleCommentEditClick = (commentId: number) => {
    const commentToEdit = comments.find(comment => comment.rno === commentId)
    if (commentToEdit) {
      setNewCommentContent(commentToEdit.rcontent) // 수정할 때 기존 댓글 내용을 가져옴
    }
    setEditingCommentId(commentId)
  }
  const handleCommentSaveClick = (commentId: number) => {
    // 댓글 수정 내용 반영
    setComments(
      comments.map(comment =>
        comment.rno === commentId
          ? {...comment, content: newCommentContent} // 수정된 내용 업데이트
          : comment
      )
    )
    setEditingCommentId(null) // 수정 상태 해제
    alert('한줄평이 수정되었습니다.')
  }

  const handleCommentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    commentId: number,
    field: keyof Comment
  ) => {
    setComments(
      comments.map(comment =>
        comment.rno === commentId ? {...comment, [field]: e.target.value} : comment
      )
    )
  }

  // 리뷰 페이지네이션 핸들러
  const handleReviewPageChange = (pageNumber: number) => setCurrentReviewPage(pageNumber)

  const indexOfLastReview = currentReviewPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

  // 한줄평 페이지네이션 핸들러
  const handleCommentPageChange = (pageNumber: number) =>
    setCurrentCommentPage(pageNumber)

  const indexOfLastComment = currentCommentPage * commentsPerPage
  const indexOfFirstComment = indexOfLastComment - commentsPerPage
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment)

  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage)
  const totalCommentPages = Math.ceil(comments.length / commentsPerPage)

  return (
    <div className={detailCSS.productPage}>
      <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
      {/* 제품 정보와 이미지 */}
      <div className={detailCSS.productHeader}>
        <div style={{textAlign: 'center'}}>
          {productImage ? (
            <img src={productImage} alt="Uploaded" className={detailCSS.productImage} />
          ) : (
            <img
              src="https://via.placeholder.com/150"
              alt="Default"
              className={detailCSS.productImage}
            />
          )}
          {editingProductImage ? (
            <div>
              <input type="file" accept="image/*" onChange={handleProductImageUpload} />
              <button className={detailCSS.saveBtn} onClick={saveProductChanges}>
                저장
              </button>
              <button className={detailCSS.cancelBtn} onClick={cancelProductChanges}>
                취소
              </button>
            </div>
          ) : (
            <button
              className={detailCSS.editBtn}
              onClick={() => setEditingProductImage(true)}>
              수정
            </button>
          )}
        </div>

        {/* 제품 정보 */}
        <div className={detailCSS.productDetails}>
          <h2>{product.pName}</h2>
          <p>
            가격:{' '}
            {editingProductFields ? (
              <input
                type="text"
                value={product.price}
                onChange={e => handleProductFieldChange(e, 'price')}
              />
            ) : (
              product.price
            )}
          </p>
          <p>
            순위:{' '}
            {editingProductFields ? (
              <input
                type="text"
                value={product.rank}
                onChange={e => handleProductFieldChange(e, 'rank')}
              />
            ) : (
              product.rank
            )}
          </p>
          <p>
            링크:{' '}
            {editingProductFields ? (
              <input
                type="text"
                value={product.link}
                onChange={e => handleProductFieldChange(e, 'link')}
              />
            ) : (
              <a href={product.link}>{product.link}</a>
            )}
          </p>
          <p>
            평점: {product.rating} / 리뷰: {product.reviews}
          </p>

          {editingProductFields ? (
            <div>
              <button className={detailCSS.saveBtn} onClick={saveProductChanges}>
                저장
              </button>
              <button className={detailCSS.cancelBtn} onClick={cancelProductChanges}>
                취소
              </button>
            </div>
          ) : (
            <button
              className={detailCSS.editBtn}
              onClick={() => setEditingProductFields(true)}>
              수정
            </button>
          )}
        </div>
      </div>
      <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
      {/* 탭 메뉴 */}
      <div className={detailCSS.tabs}>
        <button
          onClick={() => handleTabChange('productInfo')}
          className={
            activeTab === 'productInfo' && <div>Product Info Content</div>
              ? detailCSS.active
              : ''
          }>
          영양 성분 정보
        </button>
        <button
          onClick={() => handleTabChange('productReview')}
          className={
            activeTab === 'productReview' && <div>Product Reviews Content</div>
              ? detailCSS.active
              : ''
          }>
          블로그 및 판매 사이트 리뷰
        </button>
        <button
          onClick={() => handleTabChange('comments')}
          className={
            activeTab === 'comments' && <div>Comments Content</div>
              ? detailCSS.active
              : ''
          }>
          한줄평
        </button>
      </div>
      <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
      {/* 영양 성분 정보 및 이미지 업로드 */}
      {activeTab === 'productInfo' && (
        <div className={detailCSS.nutritionInfoContainer}>
          <div style={{textAlign: 'center', padding: '5px'}}>
            {nutritionImage ? (
              <img
                src={nutritionImage}
                alt="Uploaded"
                className={detailCSS.nutritionInfoImage}
              />
            ) : (
              <img
                src="https://via.placeholder.com/150"
                alt="Default"
                className={detailCSS.nutritionInfoImage}
              />
            )}
            {editingNutritionImage ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNutritionImageUpload}
                />
                <button className={detailCSS.saveBtn} onClick={saveNutritionChanges}>
                  저장
                </button>
                <button onClick={cancelNutritionChanges}>취소</button>
              </div>
            ) : (
              <button
                onClick={() => setEditingNutritionImage(true)}
                className={detailCSS.editBtn}>
                수정
              </button>
            )}
          </div>
          {/* 영양 성분 테이블 */}
          <div className={detailCSS.nutritionInfo}>
            <table className={detailCSS.nutritionTable}>
              <tbody>
                {Object.entries(product.nutritionInfo).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>
                      {editingNutritionFields ? (
                        <input
                          type="number"
                          value={value as number}
                          onChange={e =>
                            handleNumericFieldChange(e, key as keyof NutritionInfo)
                          }
                        />
                      ) : (
                        value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editingNutritionFields ? (
              <div>
                <button className={detailCSS.saveBtn} onClick={saveNutritionChanges}>
                  저장
                </button>
                <button className={detailCSS.cancelBtn} onClick={cancelNutritionChanges}>
                  취소
                </button>
              </div>
            ) : (
              <button
                className={detailCSS.editBtn}
                onClick={() => setEditingNutritionFields(true)}>
                수정
              </button>
            )}
          </div>
        </div>
      )}
      <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
      {/* 리뷰 탭 */}
      {activeTab === 'productReviews' && (
        <div className={detailCSS.productReviews}>
          <ul className={detailCSS.reviewsList}>
            {currentReviews.map(
              (
                review,
                index // map의 두번째 인자로 index 추가
              ) => (
                <React.Fragment key={review.id}>
                  <li key={review.id} className={detailCSS.reviewItem}>
                    <div className={detailCSS.reviewContainer}>
                      {' '}
                      {/* Flex container */}
                      <img
                        src={review.imageUrl}
                        alt={review.userName}
                        className={detailCSS.reviewImage}
                      />
                      <div className={detailCSS.reviewContent}>
                        {editingReviewId === review.id ? (
                          <>
                            <textarea
                              value={review.content}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleReviewInputChange(e, review.id, 'content')
                              }
                              className={detailCSS.reviewTextarea} // 더 넓은 텍스트 입력란 스타일 추가
                              style={{width: '100%', height: '100px'}} // 입력란 크기를 조정하여 글을 더 많이 보여줌
                            />
                            <div style={{display: 'flex', gap: '10px'}}>
                              {' '}
                              {/* 저장/취소 버튼을 한 줄로 */}
                              <button
                                className={detailCSS.saveBtn}
                                onClick={() => handleReviewSaveClick(review.id)}
                                style={{padding: '5px 10px'}}>
                                저장
                              </button>
                              <button
                                className={detailCSS.cancelBtn}
                                onClick={() => setEditingReviewId(null)}
                                style={{padding: '5px 10px'}}>
                                취소
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p>{review.content}</p>
                            <p>
                              작성자: {review.userName} | 날짜: {review.date}
                            </p>
                            <p>
                              평점: {'★'.repeat(review.rating)}{' '}
                              {'☆'.repeat(5 - review.rating)}
                            </p>
                            <button
                              className={detailCSS.editBtn}
                              onClick={() => handleReviewEditClick(review.id)}
                              style={{padding: '5px 10px'}} // 수정 버튼 크기 조정
                            >
                              수정
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                  {/* 리뷰마다 구분선 추가 */}
                  {index < reviews.length - 1 && (
                    <hr className={detailCSS.reviewDivider} />
                  )}
                </React.Fragment>
              )
            )}
          </ul>
          <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
          {/* 리뷰 페이지네이션 */}
          <div className={detailCSS.pagination}>
            <button
              onClick={() => handleReviewPageChange(currentReviewPage - 1)}
              disabled={currentReviewPage === 1}>
              Previous
            </button>
            {[...Array(totalReviewPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleReviewPageChange(index + 1)}
                className={currentReviewPage === index + 1 ? detailCSS.active : ''}>
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handleReviewPageChange(currentReviewPage + 1)}
              disabled={currentReviewPage === totalReviewPages}>
              Next
            </button>
          </div>
        </div>
      )}
      <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
      {/* 한줄평 탭 */}
      {activeTab === 'comments' && (
        <div className={detailCSS.commentsSection}>
          <ul className={detailCSS.commentsList}>
            {currentComments.map(
              (
                comment,
                index // map의 두번째 인자로 index 추가
              ) => (
                <React.Fragment key={comment.rno}>
                  <li key={comment.rno} className={detailCSS.commentItem}>
                    <img
                      src={comment.profileImage}
                      alt={`User ${comment.uno}`}
                      className={detailCSS.commentProfile}
                    />
                    <div className={detailCSS.commentContent}>
                      <div className={detailCSS.commentHeader}>
                        <span className={detailCSS.userName}>{comment.email}</span>
                        <span className={detailCSS.commentDate}>{comment.date}</span>
                      </div>
                      {editingCommentId === comment.rno ? (
                        <div>
                          <textarea
                            value={newCommentContent}
                            onChange={e => setNewCommentContent(e.target.value)}
                            className={detailCSS.commentEditInput}
                            style={{width: '100%', height: '100px'}}
                          />
                          <div style={{display: 'flex', gap: '10px'}}>
                            <button
                              className={detailCSS.saveBtn}
                              onClick={() => handleCommentSaveClick(comment.rno)}>
                              저장
                            </button>
                            <button
                              className={detailCSS.cancelBtn}
                              onClick={() => setEditingCommentId(null)}>
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p>{comment.rcontent}</p>
                      )}
                      <div className={detailCSS.commentFooter}>
                        {editingCommentId !== comment.rno && (
                          <button
                            className={detailCSS.editBtn}
                            onClick={() => handleCommentEditClick(comment.rno)}>
                            수정
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                  {/* 한줄평마다 구분선 추가 */}
                  {index < currentComments.length - 1 && (
                    <hr className={detailCSS.commentDivider} />
                  )}
                </React.Fragment>
              )
            )}
          </ul>
          <hr className={detailCSS.divider} /> {/* 구분선 추가 */}
          {/* 한줄평 페이지네이션 */}
          <div className={detailCSS.pagination}>
            <button
              onClick={() => handleCommentPageChange(currentCommentPage - 1)}
              disabled={currentCommentPage === 1}>
              Previous
            </button>
            {[...Array(totalCommentPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleCommentPageChange(index + 1)}
                className={currentCommentPage === index + 1 ? detailCSS.active : ''}>
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handleCommentPageChange(currentCommentPage + 1)}
              disabled={currentCommentPage === totalCommentPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPageAdmin
