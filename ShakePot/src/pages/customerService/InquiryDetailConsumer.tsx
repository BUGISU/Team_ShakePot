import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useAuth} from '../../routes/AuthContext'
import inquiryCSS from './customerServiceCSS/inquiryCSS.module.css'

interface Comment {
  id: number
  content: string
  date: string
  email: string
}

const InquiryDetailConsumer: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const [inquiry, setInquiry] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const {isAdmin, email: loggedInUser} = useAuth()

  // 문의 데이터를 불러오는 함수를 컴포넌트 외부에 정의
  const fetchInquiry = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/customerservice/${id}`)
      if (!response.ok) {
        throw new Error('문의 데이터를 불러오는 데 실패했습니다.')
      }
      const data = await response.json()
      setInquiry(data)
      setComments(data.comments || [])
      setLoading(false)
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  // useEffect에서 fetchInquiry 호출
  useEffect(() => {
    fetchInquiry()
  }, [id])

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value)
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = event.target
    setInquiry((prev: any) => ({...prev, [name]: value}))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    try {
      // 먼저 상태를 즉시 업데이트 (사용자가 수정한 값으로)
      setInquiry((prev: any) => ({
        ...prev,
        csTitle: inquiry.csTitle,
        csContent: inquiry.csContent,
        csResponse: inquiry.csResponse
      }))

      // 타이틀과 컨텐츠 출력
      // console.log('Title before save:', inquiry.csTitle)
      // console.log('Content before save:', inquiry.csContent)

      const response = await fetch(`http://localhost:8080/api/customerservice/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          csTitle: inquiry.csTitle,
          csContent: inquiry.csContent,
          csResponse: inquiry.csResponse
        })
      })

      if (!response.ok) {
        throw new Error('문의 내용을 수정하는 데 실패했습니다.')
      }

      const updatedData = await response.json() // 서버에서 받은 데이터를 사용
      // console.log('Updated Data:', updatedData)
      setInquiry(updatedData) // 상태 업데이트

      // 데이터를 다시 서버에서 가져오기
      await fetchInquiry()

      setIsEditing(false)
      alert('문의 내용이 성공적으로 수정되었습니다.')
    } catch (error) {
      // console.error('Error during save:', error)
      alert(`오류 발생: ${String(error)}`)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setInquiry((prev: any) => ({...prev})) // 기존 상태를 유지하며 편집 취소
  }

  const handleAddComment = () => {
    if (newComment.trim() === '') {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    const newCommentData = {
      id: comments.length + 1,
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      email: loggedInUser // 로그인된 사용자 이메일로 댓글 작성자 확인
    }

    setComments([...comments, newCommentData])
    setNewComment('')
  }

  const handleDeleteComment = (commentId: number, commentEmail: string) => {
    if (isAdmin || loggedInUser === commentEmail) {
      if (window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
        setComments(comments.filter(comment => comment.id !== commentId))
      }
    } else {
      alert('본인이 작성한 댓글만 삭제할 수 있습니다.')
    }
  }

  if (loading) {
    return <p>로딩 중...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  // 관리자 응답을 댓글 목록의 첫 번째에 추가
  const allComments = inquiry?.csResponse
    ? [
        {
          id: 0,
          content: `관리자 응답: ${inquiry?.csResponse}`,
          date: inquiry?.modDate || '날짜 없음',
          email: 'admin'
        },
        ...comments
      ]
    : comments

  return (
    <div className={inquiryCSS['inquiry-form']}>
      <main className={inquiryCSS.main}>
        <div className={inquiryCSS.inquiryDetails}>
          <h1 className={inquiryCSS['inquiry-title']}>
            <span>문의 내용</span>
            <div>
              <button
                className={inquiryCSS['back-btn']}
                onClick={() => navigate('/customerservice/customerservice')}>
                뒤로 가기
              </button>
              {!isEditing && (
                <button className={inquiryCSS['submit-btn']} onClick={handleEdit}>
                  문의 내용 수정
                </button>
              )}
            </div>
          </h1>

          {isEditing ? (
            <>
              <div className={inquiryCSS['flex-container']}>
                <strong>제목</strong>
                <input
                  type="text"
                  name="csTitle"
                  value={inquiry?.csTitle || ''}
                  onChange={handleInputChange}
                  className={inquiryCSS['inquiry-textarea1']}
                />
              </div>
              <div style={{marginTop: '20px'}}>
                <strong>문의내용</strong>
                <textarea
                  name="csContent"
                  value={inquiry?.csContent || ''}
                  onChange={handleInputChange}
                  className={inquiryCSS['content-box']}
                />
              </div>
              <button className={inquiryCSS['submit-btn']} onClick={handleSaveEdit}>
                저장
              </button>
              <button className={inquiryCSS['cancel-btn']} onClick={handleCancelEdit}>
                취소
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>제목:</strong> {inquiry?.csTitle}
              </p>
              <div style={{marginTop: '20px'}}>
                <strong>문의내용</strong>
                <div className={inquiryCSS['content-box']}>{inquiry?.csContent}</div>
              </div>
            </>
          )}
        </div>

        <div className={inquiryCSS.addComment}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            className={inquiryCSS['inquiry-textarea']}
            placeholder="댓글을 입력하세요"
          />
          <button className={inquiryCSS['submit-comment-btn']} onClick={handleAddComment}>
            댓글
          </button>
        </div>

        <div className={inquiryCSS.comments}>
          <strong>댓글</strong>
          {allComments.length > 0 ? (
            allComments.map(comment => (
              <div
                key={comment.id}
                className={`${inquiryCSS.comment} ${inquiryCSS['flex-container']}`}>
                <p style={{padding: '10px 0', margin: 0, flex: 1}}>{comment.content}</p>
                <small style={{display: 'block', marginTop: '5px'}}>
                  {comment.date}
                </small>{' '}
                {(isAdmin || loggedInUser === comment.email) && (
                  <button
                    className={inquiryCSS['cancel-btn']}
                    style={{marginLeft: '20px'}}
                    onClick={() => handleDeleteComment(comment.id, comment.email)}>
                    삭제
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{padding: '10px 0px 10px 0px'}}> 댓글이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default InquiryDetailConsumer
