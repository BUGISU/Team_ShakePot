import React from 'react'
import detailCSS from './detailCSS/detailCSS.module.css'

interface TabsProps {
  activeTab: string
  handleTabChange: (newTab: string) => void
}

const Tabs: React.FC<TabsProps> = ({activeTab, handleTabChange}) => {
  return (
    <div className={detailCSS.tabs}>
      <button
        onClick={() => handleTabChange('productInfo')}
        className={activeTab === 'productInfo' ? detailCSS.active : ''}>
        영양 성분 정보
      </button>
      <button
        onClick={() => handleTabChange('productReview')}
        className={activeTab === 'productReview' ? detailCSS.active : ''}>
        블로그 및 판매 사이트 리뷰
      </button>
      <button
        onClick={() => handleTabChange('comments')}
        className={activeTab === 'comments' ? detailCSS.active : ''}>
        한줄평
      </button>
    </div>
  )
}

export default Tabs
