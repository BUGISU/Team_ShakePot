import React from 'react'
import {useNavigate} from 'react-router-dom'
import mainLayoutCSS from './MainCSS/mainLayoutCSS.module.css'
import fontStyles from '../../components/font.module.css'

const MainFooter: React.FC = () => {
  return (
    <div>
      <footer className={mainLayoutCSS.footer}>
        <div className={mainLayoutCSS['footer-left']}>
          <h2 className={`${fontStyles['knewave-regular']}`} style={{fontSize: '35px'}}>
            ShackPot
          </h2>
          <p>CONTACT US</p>
        </div>
        <div className={mainLayoutCSS['footer-right']}>
          <p>Development team, 리진수</p>
          <p>
            GitHub:{' '}
            <a href="https://github.com/LiJinSu" target="_blank">
              https://github.com/LiJinSu
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
export default MainFooter
