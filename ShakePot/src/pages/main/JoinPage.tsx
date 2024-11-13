// JoinPage.jsx
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import authJoinCSS from './MainCSS/authJoinCSS.module.css' // authJoinCSS import
import fontStyles from '../../components/font.module.css'

// 이미지 파일 import
import JoinConsumerImg from '../../img/join-consumer-img.png'
import JoinCompanyImg from '../../img/join-company-img.png'

function JoinPage() {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate('/main')
  }

  const handlePersonalJoin = () => {
    navigate('/join/JoinPageConsumer')
  }

  const handleCompanyJoin = () => {
    navigate('/join/JoinPageCompany')
  }

  return (
    <div className={authJoinCSS['join-container']}>
      <button className={authJoinCSS['home-button']} onClick={handleHomeClick}>
        <AiFillHome size={32} color="#272C46" />
      </button>
      <h1 className={fontStyles['knewave-regular']} style={{color: '#272C46'}}>
        ShakePot
      </h1>
      <div className={authJoinCSS['join-selection']}>
        <div className={authJoinCSS['join-option']} onClick={handlePersonalJoin}>
          <img src={JoinConsumerImg} alt="개인회원" />
        </div>
        <div className={authJoinCSS['join-option']} onClick={handleCompanyJoin}>
          <img src={JoinCompanyImg} alt="기업회원" />
        </div>
      </div>
    </div>
  )
}

export default JoinPage
