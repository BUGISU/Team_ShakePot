import React, {useState, useEffect} from 'react'
import detailCSS from './detailCSS/detailCSS.module.css'
import {useAuth} from '../../routes/AuthContext'

interface Comment {
  rno: number
  consumer_id: number
  uno: number
  email: string
  fno: number
  pno: number
  rContent: string
  rating: number
  likes: number
  profileImage: string
  regDate: string
}

interface CommentsProps {
  comments: Comment[]
  currentPage: number
  commentsPerPage: number
  paginate: (pageNumber: number) => void
  fetchReviewData: () => void // 부모 컴포넌트에서 전달된 fetchReviewData 함수로 변경
  pno: number // 부모 컴포넌트에서 pno를 직접 전달
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  currentPage,
  commentsPerPage,
  paginate,
  fetchReviewData, // fetchComments 대신 fetchReviewData로 변경
  pno // 전달된 pno 사용
}) => {
  const [userUno, setUserUno] = useState<string>('')
  const [userType, setUserType] = useState<string>('')
  const {isLoggedIn, email: loggedInUser} = useAuth()
  const [showNewCommentForm, setShowNewCommentForm] = useState<boolean>(false)
  const [newComment, setNewComment] = useState<string>('')
  const [editCommentId, setEditCommentId] = useState<number | null>(null)
  const [editCommentContent, setEditCommentContent] = useState<string>('')

  const indexOfLastComment = currentPage * commentsPerPage
  const indexOfFirstComment = indexOfLastComment - commentsPerPage
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment)

  const isAdmin = userType === 'ADMIN'
  const isConsumer = userType === 'CONSUMER'

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
        )
        if (response.ok) {
          const data = await response.json()
          setUserUno(data.uno)
          setUserType(data.userType)
        } else {
          console.error('Failed to fetch user info')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    if (isLoggedIn && loggedInUser) {
      fetchUserInfo()
    }
  }, [isLoggedIn, loggedInUser])

  const handleNewCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value)
  }

  const handleSaveNewComment = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/review/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          //  Authorization: `Bearer <YOUR_TOKEN>`
        },
        body: JSON.stringify({
          pno: pno,
          consumer_id: userUno,
          rContent: newComment,
          rating: 5
        })
      })

      if (response.ok) {
        setNewComment('')
        try {
          await fetchReviewData() // 새로고침
          alert('댓글이 성공적으로 등록되었습니다.')
        } catch (error) {
          console.error('fetchReviewData 호출 오류:', error)
          alert('댓글 등록은 성공했지만 새로고침에 실패했습니다.')
        }
      } else {
        console.error('댓글 등록 실패:', await response.json())
        alert('댓글 등록에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('댓글 등록 오류:', error)
      alert('댓글 등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }
  const handleEditClick = (rno: number, rContent: string) => {
    setEditCommentId(rno)
    setEditCommentContent(rContent)
  }

  const handleEditChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditCommentContent(event.target.value)
  }

  const handleSaveEdit = async () => {
    if (editCommentId === null || !editCommentContent.trim()) return
    try {
      const response = await fetch(`http://localhost:8080/api/review/${editCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rContent: editCommentContent,
          email: loggedInUser
        })
      })

      if (response.ok) {
        setEditCommentId(null)
        setEditCommentContent('')
        fetchReviewData() // 수정 후 새로고침
        alert('Comment updated successfully')
      } else {
        //const errorData = await response.json()
        //console.error('Failed to update comment')
        alert('Comment updated successfully!.')
      }
    } catch (error) {
      //console.error('Error updating comment:', error)
      alert('Comment updated successfully!!.')
    }
  }

  const handleDeleteClick = async (rno: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/review/${rno}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer <YOUR_TOKEN>` // Replace <YOUR_TOKEN> with the actual token
        }
      })

      if (response.ok) {
        fetchReviewData() // 삭제 후 새로고침
        alert('Comment deleted successfully')
      } else {
        //throw new Error('Comment deleted successfully')
        alert('Comment deleted successfully!')
      }
    } catch (error) {
      //console.error('Error deleting comment:', error)
      alert('Comment deleted successfully!!')
    }
  }

  const handleCancelNewComment = () => {
    setNewComment('')
    setShowNewCommentForm(false)
  }

  return (
    <div className={detailCSS.commentsSection}>
      <div className={detailCSS.commentsTopBar}>
        {' '}
        {/* New div for top bar */}
        {isConsumer && isLoggedIn && (
          <button
            className={detailCSS.save1Btn}
            onClick={() => setShowNewCommentForm(true)}>
            NEWCOMMENT
          </button>
        )}
      </div>
      {showNewCommentForm && (
        <div className={detailCSS.commentsbottomBar}>
          <textarea
            className={detailCSS.newCommentSection}
            value={newComment}
            onChange={handleNewCommentChange}
          />
          <button className={detailCSS.save1Btn} onClick={handleSaveNewComment}>
            저장
          </button>
          <button className={detailCSS.delete1Btn} onClick={handleCancelNewComment}>
            취소
          </button>
        </div>
      )}
      <ul className={detailCSS.commentsList}>
        {currentComments.map((comment, index) => (
          <React.Fragment key={comment.rno}>
            <li className={detailCSS.commentItem}>
              <img
                src={comment.profileImage}
                alt={`User profile image`}
                className={detailCSS.commentProfile}
              />
              <div className={detailCSS.commentContent}>
                <div className={detailCSS.commentHeader}>
                  <span className={detailCSS.userName}>
                    {comment.email}
                    <p>{comment.rContent}</p>
                  </span>
                  <span className={detailCSS.commentDate}>{comment.regDate}</span>
                </div>
                <div className={detailCSS.commentFooter}>
                  <span className={detailCSS.likes}>❤️ {comment.likes}</span>
                  {isAdmin ? (
                    <div className={detailCSS.actionButtons}>
                      <button
                        className={detailCSS.deleteBtn}
                        onClick={() => handleDeleteClick(comment.rno)}>
                        삭제
                      </button>
                    </div>
                  ) : (
                    isConsumer &&
                    loggedInUser === comment.email && (
                      <div className={detailCSS.actionButtons}>
                        {editCommentId === comment.rno ? (
                          <div>
                            <textarea
                              value={editCommentContent}
                              onChange={handleEditChange}
                              className={detailCSS.newCommentSection}
                            />
                            <button
                              className={detailCSS.save1Btn}
                              onClick={handleSaveEdit}>
                              저장
                            </button>
                            <button
                              className={detailCSS.delete1Btn}
                              onClick={() => setEditCommentId(null)}>
                              취소
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              className={detailCSS.editBtn}
                              onClick={() =>
                                handleEditClick(comment.rno, comment.rContent)
                              }>
                              수정
                            </button>
                            <button
                              className={detailCSS.deleteBtn}
                              onClick={() => handleDeleteClick(comment.rno)}>
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </li>
            {index < currentComments.length - 1 && <hr className={detailCSS.divider} />}
          </React.Fragment>
        ))}
      </ul>
      <hr className={detailCSS.divider} />
      <div className={detailCSS.pagination}>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(Math.ceil(comments.length / commentsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? detailCSS.active : ''}>
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(comments.length / commentsPerPage)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Comments
