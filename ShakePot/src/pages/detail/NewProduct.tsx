import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../routes/AuthContext'
import newproductCSS from './detailCSS/newproductCSS.module.css'
import fontStyles from '../../components/font.module.css'

interface ProductInfo {
  pName: string
  price: number | null
  link: string
  company_id: number | null // 수정된 필드명
  category: string
  taste: string
  calorie: number | null
  carbohydrate: number | null
  sugar: number | null
  protein: number | null
  fat: number | null
  transFat: number | null
  saturatedFat: number | null
  cholesterol: number | null
  sodium: number | null
}

const initialProductState: ProductInfo = {
  pName: '',
  price: null,
  link: '',
  company_id: null, // 수정된 필드명
  category: '',
  taste: '',
  calorie: null,
  carbohydrate: null,
  sugar: null,
  protein: null,
  fat: null,
  transFat: null,
  saturatedFat: null,
  cholesterol: null,
  sodium: null
}

const NewProductForm = () => {
  const [productInfo, setProductInfo] = useState<ProductInfo>(initialProductState)
  const [productImage, setProductImage] = useState<File | null>(null)
  const [nutritionImage, setNutritionImage] = useState<File | null>(null)
  const navigate = useNavigate()
  const [userUno, setUserUno] = useState<string>('') // 사용자 유형
  const [userType, setUserType] = useState<string>('') // 사용자 유형
  const {isLoggedIn, email: loggedInUser} = useAuth() // AuthContext에서 로그인 정보 가져옴

  // 관리자인지 여부
  // 사용자 유형에 따른 분기
  const isAdmin = userType === 'ADMIN'
  const isConsumer = userType === 'CONSUMER'
  const isCompany = userType === 'COMPANY'
  useEffect(() => {
    const fetchUserInfo = async () => {
      // console.log('loggedInUser', loggedInUser)
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
        )
        if (response.ok) {
          const data = await response.json()
          setUserUno(data.uno) // uno 값 설정
          setUserType(data.userType) // dtype 값 설정
          // console.log('data', data)
          // console.log('data.dtype', data.userType)
        } else {
          console.error('Failed to fetch user info')
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    if (isLoggedIn && loggedInUser) {
      fetchUserInfo() // 로그인된 경우에만 사용자 정보를 가져옴
    }
  }, [isLoggedIn, loggedInUser])

  // 데이터가 제대로 준비되었는지 확인
  console.log('Submitting product data:', {
    product: productInfo,
    productImage,
    nutritionImage
  })

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    const parsedValue = value === '' ? null : Number(value)
    setProductInfo(prev => ({
      ...prev,
      [name]: isNaN(parsedValue) ? value : parsedValue
    }))
  }

  // 이미지 업로드 핸들러
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files ? e.target.files[0] : null
    setImage(file)
  }

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAdmin) {
      alert('관리자만 제품을 등록할 수 있습니다.')
      return
    }

    const formData = new FormData()
    formData.append('product', JSON.stringify(productInfo))
    if (productImage) formData.append('productImage', productImage)
    if (nutritionImage) formData.append('nutritionImage', nutritionImage)

    try {
      const response = await fetch('http://localhost:8080/api/product/register', {
        method: 'POST',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9...` // 인증 토큰 추가
        },
        body: formData,
        credentials: 'include'
      })

      if (response.ok) {
        alert('제품 등록에 성공했습니다!')
        navigate('/category/sugar')
      } else {
        console.error('Error:', await response.text())
        alert('제품 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className={newproductCSS.container}>
      <h1 className={fontStyles['knewave-regular']}>New Product</h1>
      <div className={newproductCSS['form-group']}>
        <label>Product Name:</label>
        <input
          type="text"
          name="pName"
          value={productInfo.pName}
          onChange={handleChange}
        />
      </div>
      <div className={newproductCSS['form-group']}>
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={productInfo.category || ''}
          onChange={handleChange}
        />
      </div>
      <div className={newproductCSS['form-group']}>
        <label>Product taste:</label>
        <input
          type="text"
          name="taste"
          value={productInfo.taste}
          onChange={handleChange}
        />
      </div>

      <div className={newproductCSS['form-group']}>
        <label>Company ID:</label>
        <input
          type="number"
          name="company_id"
          value={productInfo.company_id ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className={newproductCSS['form-group']}>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={productInfo.price ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className={newproductCSS['form-group']}>
        <label>Link:</label>
        <input type="text" name="link" value={productInfo.link} onChange={handleChange} />
      </div>

      <div className={newproductCSS['form-group']}>
        <label>Product Image:</label>
        <input
          type="file"
          onChange={e => handleImageUpload(e, setProductImage)}
          className={newproductCSS['file-input']}
        />
      </div>

      <div
        className={`${newproductCSS['nutrition-section']} ${newproductCSS['section-title']}`}>
        Nutrition Information
      </div>
      {[
        'calorie',
        'carbohydrate',
        'sugar',
        'protein',
        'fat',
        'transFat',
        'saturatedFat',
        'cholesterol',
        'sodium'
      ].map(field => (
        <div key={field} className={newproductCSS['form-group']}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          <input
            type="number"
            name={field}
            value={productInfo[field as keyof ProductInfo] ?? ''}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className={newproductCSS['form-group']}>
        <label>Nutrition Image:</label>
        <input
          type="file"
          onChange={e => handleImageUpload(e, setNutritionImage)}
          className={newproductCSS['file-input']}
        />
      </div>
      <div className={newproductCSS['actions']}>
        <button
          className={newproductCSS['submit-button']}
          onClick={handleSubmit}
          disabled={!isAdmin}>
          제품 등록
        </button>

        {/* 뒤로가기 버튼 */}

        <button
          className={newproductCSS['back-btn']}
          onClick={() => navigate('/category/taste')}>
          뒤로가기
        </button>
      </div>
    </div>
  )
}

export default NewProductForm
