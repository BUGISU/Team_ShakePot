import React from 'react'
import detailCSS from './detailCSS/detailCSS.module.css'

interface Review {
  id: number
  userName: string
  content: string
  rating: number
  date: string
  imageUrl: string
}

interface ProductReviewProps {
  reviews: Review[]
  currentPage: number
  reviewsPerPage: number
  paginate: (pageNumber: number) => void
}

const ProductReview: React.FC<ProductReviewProps> = ({
  reviews,
  currentPage,
  reviewsPerPage,
  paginate
}) => {
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

  return (
    <div className={detailCSS.productReviews}>
      <ul className={detailCSS.reviewsList}>
        {currentReviews.map((review, index) => (
          <React.Fragment key={review.id}>
            <li key={review.id} className={detailCSS.reviewItem}>
              <div className={detailCSS.reviewContainer}>
                <img
                  src={review.imageUrl}
                  alt={review.userName}
                  className={detailCSS.reviewImage}
                />
                <div className={detailCSS.reviewContent}>
                  <p>{review.content}</p>
                  <p>
                    작성자: {review.userName} | 날짜: {review.date}
                  </p>
                  <p>
                    평점: {'★'.repeat(review.rating)} {'☆'.repeat(5 - review.rating)}
                  </p>
                </div>
              </div>
            </li>
            {index < currentReviews.length - 1 && <hr className={detailCSS.divider} />}
          </React.Fragment>
        ))}
      </ul>
      <hr className={detailCSS.divider} />
      <div className={detailCSS.pagination}>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(Math.ceil(reviews.length / reviewsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? detailCSS.active : ''}>
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default ProductReview
