import React, {useEffect, useState} from 'react'
import detailCSS from './detailCSS/detailCSS.module.css'
import {useAuth} from '../../routes/AuthContext'

interface NutritionTableProps {
  product: any
  setProduct: (product: any) => void
}

const NutritionTable: React.FC<NutritionTableProps> = ({product, setProduct}) => {
  const [userType, setUserType] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const {isLoggedIn, email: loggedInUser} = useAuth()
  const [editingNutritionFields, setEditingNutritionFields] = useState<boolean>(false)
  const [editingNutritionImage, setEditingNutritionImage] = useState<boolean>(false)

  const [nutritionImage, setNutritionImage] = useState<string | null>(
    product.nutritionImage ||
      'https://shop-phinf.pstatic.net/20240523_160/1716449339957gEexS_PNG/KakaoTalk_20240510_104550415_04.png?type=w860'
  )
  const [currentNutrition, setCurrentNutrition] = useState(product)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
        )
        if (response.ok) {
          const data = await response.json()
          setUserType(data.userType)
          setUserEmail(data.email) // 사용자 이메일 설정
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

  useEffect(() => {
    setCurrentNutrition(product)
  }, [product])

  // 수정 권한 설정: ADMIN이거나, COMPANY이고 로그인한 이메일이 제품의 회사 이메일과 일치할 경우, 이부분 추후 수정예정
  const canEdit = userType === 'ADMIN' || userType === 'COMPANY'

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setCurrentNutrition(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const saveNutritionChanges = async () => {
    if (!canEdit) {
      alert('You are not authorized to save changes.')
      return
    }
    try {
      const updatedProduct = {
        ...product,
        ...currentNutrition,
        nutritionImage:
          nutritionImage !== 'https://via.placeholder.com/150'
            ? nutritionImage
            : product.nutritionImage
      }

      const formData = new FormData()
      formData.append('product', JSON.stringify(updatedProduct))

      const response = await fetch(`http://localhost:8080/api/product/${product.pno}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer <YOUR_TOKEN>`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setProduct(result)
        setEditingNutritionFields(false)
        setEditingNutritionImage(false)
        alert('Product updated successfully.')
      } else {
        throw new Error('Failed to update product information.')
      }
    } catch (error) {
      console.error('Error updating product information:', error)
      alert('Error updating product information.')
    }
  }

  const cancelNutritionChanges = () => {
    setCurrentNutrition(product) // 수정 취소 시 원래 상태로 복원
    setEditingNutritionFields(false)
  }

  // 이미지 업로드 핸들러
  const handleNutritionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => setNutritionImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={detailCSS.nutritionInfoContainer}>
      <div style={{textAlign: 'center', padding: '5px'}}>
        {nutritionImage ? (
          <img
            src={nutritionImage}
            alt="Uploaded"
            className={detailCSS.nutritionInfoImage}
          />
        ) : (
          <img
            src="https://shop-phinf.pstatic.net/20231106_175/1699264285882dRr9N_JPEG/26182856288491308_590926921.jpg?type=f296_240"
            alt="Default"
            className={detailCSS.nutritionInfoImage}
          />
        )}
        {canEdit && editingNutritionImage ? (
          <div>
            <input type="file" accept="image/*" onChange={handleNutritionImageUpload} />
            <button
              className={detailCSS.saveBtn}
              onClick={() => setEditingNutritionImage(false)}>
              저장
            </button>
            <button
              onClick={() => setEditingNutritionImage(false)}
              className={detailCSS.cancelBtn}>
              취소
            </button>
          </div>
        ) : (
          canEdit && (
            <button
              onClick={() => setEditingNutritionImage(true)}
              className={detailCSS.editBtn}>
              이미지 수정
            </button>
          )
        )}
      </div>

      <table className={detailCSS.nutritionTable}>
        <tbody>
          {canEdit && editingNutritionFields ? (
            <>
              <tr>
                <td>칼로리</td>
                <td>
                  <input
                    type="number"
                    name="calorie"
                    value={currentNutrition.calorie}
                    onChange={handleNutritionChange}
                  />{' '}
                  kcal
                </td>
              </tr>
              <tr>
                <td>탄수화물</td>
                <td>
                  <input
                    type="number"
                    name="carbohydrate"
                    value={currentNutrition.carbohydrate}
                    onChange={handleNutritionChange}
                  />{' '}
                  g
                </td>
              </tr>
              <tr>
                <td>당류</td>
                <td>
                  <input
                    type="number"
                    name="sugar"
                    value={currentNutrition.sugar}
                    onChange={handleNutritionChange}
                  />{' '}
                  g
                </td>
              </tr>
              <tr>
                <td>단백질</td>
                <td>
                  <input
                    type="number"
                    name="protein"
                    value={currentNutrition.protein}
                    onChange={handleNutritionChange}
                  />{' '}
                  g
                </td>
              </tr>
              <tr>
                <td>지방</td>
                <td>
                  <input
                    type="number"
                    name="fat"
                    value={currentNutrition.fat}
                    onChange={handleNutritionChange}
                  />{' '}
                  g
                </td>
              </tr>
              <tr>
                <td>트랜스지방</td>
                <td>
                  <input
                    type="number"
                    name="transFat"
                    value={currentNutrition.transFat}
                    onChange={handleNutritionChange}
                  />{' '}
                  g
                </td>
              </tr>
              <tr>
                <td>포화지방</td>
                <td>
                  <input
                    type="number"
                    name="saturatedFat"
                    value={currentNutrition.saturatedFat}
                    onChange={handleNutritionChange}
                  />{' '}
                  g
                </td>
              </tr>
              <tr>
                <td>콜레스테롤</td>
                <td>
                  <input
                    type="number"
                    name="cholesterol"
                    value={currentNutrition.cholesterol}
                    onChange={handleNutritionChange}
                  />{' '}
                  mg
                </td>
              </tr>
              <tr>
                <td>나트륨</td>
                <td>
                  <input
                    type="number"
                    name="sodium"
                    value={currentNutrition.sodium}
                    onChange={handleNutritionChange}
                  />{' '}
                  mg
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <td>칼로리</td>
                <td>{product.calorie} kcal</td>
              </tr>
              <tr>
                <td>탄수화물</td>
                <td>{product.carbohydrate} g</td>
              </tr>
              <tr>
                <td>당류</td>
                <td>{product.sugar} g</td>
              </tr>
              <tr>
                <td>단백질</td>
                <td>{product.protein} g</td>
              </tr>
              <tr>
                <td>지방</td>
                <td>{product.fat} g</td>
              </tr>
              <tr>
                <td>트랜스지방</td>
                <td>{product.transFat} g</td>
              </tr>
              <tr>
                <td>포화지방</td>
                <td>{product.saturatedFat} g</td>
              </tr>
              <tr>
                <td>콜레스테롤</td>
                <td>{product.cholesterol} mg</td>
              </tr>
              <tr>
                <td>나트륨</td>
                <td>{product.sodium} mg</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* 영양 성분 수정 버튼 */}
      {canEdit && (
        <div>
          {editingNutritionFields ? (
            <div>
              <button className={detailCSS.saveBtn} onClick={saveNutritionChanges}>
                저장
              </button>
              <button className={detailCSS.deleteBtn} onClick={cancelNutritionChanges}>
                취소
              </button>
            </div>
          ) : (
            <button
              className={detailCSS.editBtn}
              onClick={() => setEditingNutritionFields(true)}>
              영양 성분 수정
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default NutritionTable
