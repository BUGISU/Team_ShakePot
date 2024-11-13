import React, {useEffect, useState} from 'react'
import detailCSS from './detailCSS/detailCSS.module.css'
import {useAuth} from '../../routes/AuthContext'

const ProductDetail = ({
  product,
  setProduct, // product 상태 업데이트 함수를 추가합니다
  isEditing,
  setEditing = () => {},
  handleEdit = () => {}
}) => {
  const [userType, setUserType] = useState('')
  const [editingProductImage, setEditingProductImage] = useState(false)
  const [productImage, setProductImage] = useState(
    product.defaultImage ||
      'https://shop-phinf.pstatic.net/20231106_175/1699264285882dRr9N_JPEG/26182856288491308_590926921.jpg?type=f296_240'
  )
  const [currentProduct, setCurrentProduct] = useState(product)
  const [randomRank, setRandomRank] = useState(0) // 랜덤 순위를 저장할 상태 추가
  const {isLoggedIn, email: loggedInUser} = useAuth()

  useEffect(() => {
    if (isLoggedIn && loggedInUser) {
      fetchUserInfo()
    }
  }, [isLoggedIn, loggedInUser])

  // product가 변경될 때마다 currentProduct를 업데이트
  useEffect(() => {
    setCurrentProduct(product)
  }, [product])

  // 컴포넌트가 처음 렌더링될 때 1~100 사이의 랜덤 순위를 생성
  useEffect(() => {
    setRandomRank(Math.floor(Math.random() * 10) + 1)
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/user-info?email=${loggedInUser}`
      )
      if (response.ok) {
        const data = await response.json()
        setUserType(data.userType)
      } else {
        console.error('Failed to fetch user info')
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const isAdmin = userType === 'ADMIN'

  const handleProductImageUpload = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProductImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = e => {
    const {name, value} = e.target
    setCurrentProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }))
  }

  const saveProductChanges = async () => {
    if (!isAdmin) {
      alert('You are not authorized to save changes.')
      return
    }
    try {
      const formData = new FormData()
      formData.append('product', JSON.stringify({...currentProduct}))
      if (productImage !== product.defaultImage) {
        formData.append('productImage', productImage)
      }

      const response = await fetch(`http://localhost:8080/api/product/${product.pno}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer <YOUR_TOKEN>`
        },
        body: formData
      })

      if (response.ok) {
        const updatedProduct = await response.json() // 서버에서 반환된 업데이트된 데이터를 받아옵니다.
        setCurrentProduct(updatedProduct) // 업데이트된 데이터를 상태에 반영하여 화면에 즉시 표시되도록 합니다.
        setEditingProductImage(false)
        setEditing(false) // 수정 모드를 종료합니다.
        alert('Product updated successfully.')
      } else {
        throw new Error('Failed to update the product.')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product.')
    }
  }

  const cancelProductChanges = () => {
    setEditingProductImage(false)
    setProductImage(product.defaultImage || 'https://via.placeholder.com/150')
    setCurrentProduct(product) // 취소 시 현재 상품 정보를 원래 상태로 되돌림
    setEditing(false)
  }

  return (
    <div className={detailCSS.productHeader}>
      <div style={{textAlign: 'center'}}>
        <img src={productImage} alt="Product" className={detailCSS.productImage} />
        {isAdmin && editingProductImage ? (
          <div>
            <input type="file" accept="image/*" onChange={handleProductImageUpload} />
            <button className={detailCSS.saveBtn} onClick={saveProductChanges}>
              저장
            </button>
            <button className={detailCSS.deleteBtn} onClick={cancelProductChanges}>
              취소
            </button>
          </div>
        ) : (
          isAdmin && (
            <button
              className={detailCSS.editBtn}
              onClick={() => {
                setEditing(true)
                setEditingProductImage(true)
              }}>
              이미지 수정
            </button>
          )
        )}
      </div>

      <div className={detailCSS.productDetails}>
        {isEditing ? (
          <>
            <input
              type="text"
              name="pName"
              value={currentProduct.pName}
              onChange={handleInputChange}
              className={detailCSS.inputField}
            />
            <input
              type="number"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              className={detailCSS.inputField}
            />
            <input
              type="number"
              name="rank"
              value={currentProduct.rank}
              onChange={handleInputChange}
              className={detailCSS.inputField}
            />
            <button onClick={saveProductChanges} className={detailCSS.saveBtn}>
              저장
            </button>
            <button className={detailCSS.deleteBtn} onClick={cancelProductChanges}>
              취소
            </button>
          </>
        ) : (
          <>
            <h2>제품명: {product.pName}</h2>
            <p>가격: {product.price.toLocaleString()}원</p>
            <p>네이버 판매순위: {randomRank}위</p>
            {isAdmin && (
              <button onClick={handleEdit} className={detailCSS.editBtn}>
                수정
              </button>
            )}
          </>
        )}
        <p>
          <a
            href="https://smartstore.naver.com/life_b/products/8591285042?nl-query=%EC%89%90%EC%9D%B4%ED%81%AC&nl-ts-pid=iylTfdqo1e8ssKgEJMlssssst60-296690&NaPm=ct%3Dm32afb7k%7Cci%3Df6eff2c3d0b4e7c6a83b000ecd7b3b8883b43e71%7Ctr%3Dsls%7Csn%3D6294575%7Chk%3Db3e8a7046889f50ea9005514840b0c4ce0775a9d"
            target="_blank"
            rel="noopener noreferrer">
            판매사이트 이동
          </a>
        </p>
        <p>
          ★ {product.rating} / {product.reviews} reviews
        </p>
      </div>
    </div>
  )
}

export default ProductDetail
