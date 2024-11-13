import React from 'react'
import {Routes, Route} from 'react-router-dom'
import NoMatch from './NoMatch'
import Layout from '../pages/main/Layout' // Layout 추가

// 제품 상세 페이지
import Detailpage from '../pages/detail/Detailpage'
import DetailpageAdmin from '../pages/detail/DetailpageAdmin'
import DetailpageCompany from '../pages/detail/DetailpageCompany'
import DetailpageConsumer from '../pages/detail/Tabs'
import NewProduct from '../pages/detail/NewProduct'

// 고객센터 페이지
import CustomerService from '../pages/customerService/CustomerService'
import InquiryDetailAdmin from '../pages/customerService/InquiryDetailAdmin'
import InquiryDetailConsumer from '../pages/customerService/InquiryDetailConsumer'
import InquiryForm from '../pages/customerService/InquiryForm'

// 카테고리 페이지
import Category_CaloriePage from '../pages/category/CaloriePage'
import Category_ProteinPage from '../pages/category/ProteinPage'
import Category_SugarPage from '../pages/category/SugarPage'
import Category_TastePage from '../pages/category/TastePage'

// 메인 페이지
import LoginPage from '../pages/main/LoginPage'
import JoinPage from '../pages/main/JoinPage'
import MainPage from '../pages/main/MainPage'
import MainPageLogin from '../pages/main/MainPageLogin'
import JoinPageConsumer from '../pages/main/JoinPageConsumer'
import JoinPageCompany from '../pages/main/JoinPageCompany'

// 마이페이지 관련
import MyPageAdmin from '../pages/mypage/MypageAdmin'
import MyPageConsumer from '../pages/mypage/MypageConsumer'
import MyPageCompany from '../pages/mypage/MypageCompany'
import InfoModifyConsumer from '../pages/mypage/InfoModifyConsumer'
import InfoModifyCompany from '../pages/mypage/InfoModifyCompany'

// PrivateRoute 임포트
import PrivateRoute from './PrivateRoute'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="*" element={<NoMatch />} />

      {/* 로그인 및 회원가입 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/join/JoinPageConsumer" element={<JoinPageConsumer />} />
      <Route path="/join/JoinPageCompany" element={<JoinPageCompany />} />

      {/* Layout 적용이 필요한 경로 */}
      <Route element={<Layout />}>
        <Route
          path="/myPage/MyPageConsumer/:uno"
          element={
            <PrivateRoute component={MyPageConsumer} requiredUserType="CONSUMER" />
          }
        />
        <Route
          path="/myPage/MyPageAdmin/:uno"
          element={<PrivateRoute component={MyPageAdmin} requiredUserType="ADMIN" />}
        />
        <Route
          path="/myPage/MyPageCompany/:uno"
          element={<PrivateRoute component={MyPageCompany} requiredUserType="COMPANY" />}
        />
        <Route path="/infoModifyConsumer" element={<InfoModifyConsumer />} />
        <Route path="/infoModifyCompany" element={<InfoModifyCompany />} />

        {/* 메인 페이지 */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/mainPageLogin" element={<MainPage />} />
        <Route path="/" element={<MainPage />} />

        {/* 카테고리 페이지 */}
        <Route path="/category/calorie" element={<Category_CaloriePage />} />
        <Route path="/category/protein" element={<Category_ProteinPage />} />
        <Route path="/category/sugar" element={<Category_SugarPage />} />
        <Route path="/category/taste" element={<Category_TastePage />} />

        {/* 제품 상세 페이지 */}
        <Route path="/detail/detailpageadmin" element={<DetailpageAdmin />} />
        <Route path="/detail/:fno/:pno/:tab" element={<Detailpage />} />
        <Route
          path="/detail/:fno/productInfo"
          element={<Detailpage defaultTab="productInfo" />}
        />
        <Route
          path="/detail/:fno/productReview"
          element={<Detailpage defaultTab="productReview" />}
        />
        <Route
          path="/detail/:pno/comments"
          element={<Detailpage defaultTab="comments" />}
        />
        <Route path="/detail/newproduct/" element={<NewProduct />} />

        {/* 고객센터 페이지 */}
        <Route path="/customerservice/customerservice" element={<CustomerService />} />
        <Route
          path="/customerservice/inquirydetailadmin/:id"
          element={<InquiryDetailAdmin />}
        />
        <Route
          path="/customerservice/inquirydetailconsumer/:id"
          element={<InquiryDetailConsumer />}
        />

        {/* 문의하기 */}
        <Route path="/customerservice/inquiryform" element={<InquiryForm />} />
      </Route>
    </Routes>
  )
}
