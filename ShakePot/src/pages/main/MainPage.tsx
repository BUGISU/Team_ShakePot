import React from 'react'
import {useNavigate} from 'react-router-dom'
import mainCSS from './MainCSS/mainCSS.module.css'
import fontStyles from '../../components/font.module.css'

// 카테고리 이미지 Path
import calorieImage from '../../img/main-category-calorie1.png' // 경로는 파일의 위치에 따라 달라질 수 있습니다.
import proteinImage from '../../img/main-category-protein1.png' // 경로는 파일의 위치에 따라 달라질 수 있습니다.
import sugarImage from '../../img/main-category-sugar1.png' // 경로는 파일의 위치에 따라 달라질 수 있습니다.
import tasteImage from '../../img/main-category-taste1.png' // 경로는 파일의 위치에 따라 달라질 수 있습니다.

export default function MainPage() {
  const navigate = useNavigate()

  return (
    <div className={mainCSS['app']}>
      {/* 배너 및 내용 */}
      <section className={mainCSS['banner']}>
        <h1 className={`${fontStyles['knewave-regular']} ${fontStyles['banner-title']}`}>
          ShakePot
        </h1>
        <p className={mainCSS['banner-subtitle']}>내 몸에 딱 맞는 영양 솔루션</p>
      </section>

      <section className={mainCSS['category-section']}>
        {/* 카테고리 카드 */}
        <div
          className={mainCSS['category-card']}
          onClick={() => navigate('/category/taste')}>
          <img src={tasteImage} alt="Taste" className={mainCSS['category-image']} />
          <div
            className={`${fontStyles['roboto-bold-italic']} 
              ${mainCSS['category-title']}`}>
            Taste
          </div>
        </div>
        <div
          className={mainCSS['category-card']}
          onClick={() => navigate('/category/sugar')}>
          <img src={sugarImage} alt="Sugar" className={mainCSS['category-image']} />
          <div
            className={`${fontStyles['roboto-bold-italic']} 
              ${mainCSS['category-title']}`}>
            Sugar
          </div>
        </div>
        <div
          className={mainCSS['category-card']}
          onClick={() => navigate('/category/protein')}>
          <img src={proteinImage} alt="Protein" className={mainCSS['category-image']} />
          <div
            className={`${fontStyles['roboto-bold-italic']} 
              ${mainCSS['category-title']}`}>
            Protein
          </div>
        </div>
        <div
          className={mainCSS['category-card']}
          onClick={() => navigate('/category/calorie')}>
          <img src={calorieImage} alt="Calorie" className={mainCSS['category-image']} />
          <div
            className={`${fontStyles['roboto-bold-italic']} 
              ${mainCSS['category-title']}`}>
            Calorie
          </div>
        </div>
      </section>
    </div>
  )
}
