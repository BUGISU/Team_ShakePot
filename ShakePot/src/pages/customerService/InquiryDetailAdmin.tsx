import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import inquiryCSS from './customerServiceCSS/inquiryCSS.module.css'

interface Comment {
  id: number
  content: string
  date: string
}

const InquiryDetailAdmin: React.FC = () => {
  const {id} = useParams<{id: string}>() // URL에서 id 가져오기
  const navigate = useNavigate()
  const [inquiry, setInquiry] = useState<any>(null) // 서버에서 가져올 문의 데이터
  const [comments, setComments] = useState<Comment[]>([]) // 댓글 상태
  const [loading, setLoading] = useState<boolean>(true) // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null) // 오류 상태 관리

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/customerservice/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch inquiry data')
        }
        const data = await response.json()
        setInquiry(data)
        setComments(data.comments || [])
        setLoading(false)
        console.log(data)
      } catch (error: any) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchInquiry()
  }, [id])

  if (loading) {
    return <p>로딩 중...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className={inquiryCSS.app}>
      <div className={inquiryCSS['inquiry-form']}>
        <main className={inquiryCSS.main}>
          <h1 className={inquiryCSS['inquiry-title']}>문의내용</h1>

          {/* 제목 */}
          <div className={inquiryCSS['section']}>
            <label className={inquiryCSS['label']}>제목</label>
            <p className={inquiryCSS['input-text']}>{inquiry.csTitle}</p>
          </div>

          {/* 문의내용 */}
          <div className={inquiryCSS['section']}>
            <label className={inquiryCSS['label']}>문의내용</label>
            <div className={inquiryCSS['content-box']}>{inquiry.csContent}</div>
          </div>

          {/* 댓글 */}
          <div className={inquiryCSS['section']}>
            <label className={inquiryCSS['label']}>댓글</label>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className={inquiryCSS['comment-box']}>
                  <p>{comment.content}</p>
                  <small>{comment.date}</small>
                </div>
              ))
            ) : (
              <p>댓글이 없습니다.</p>
            )}
          </div>

          {/* 뒤로가기 버튼 */}
          <div className={inquiryCSS['actions']}>
            <button
              className={inquiryCSS['back-btn']}
              onClick={() => navigate('/customerservice/customerservice')}>
              뒤로가기
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default InquiryDetailAdmin
