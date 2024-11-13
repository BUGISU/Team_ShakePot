import React, {useState} from 'react'
import styled from 'styled-components'

// Styled-components를 사용하여 스타일 정의
const DropdownWrapper = styled.div`
  margin: 30px 0;
  text-align: center;
`

const StyledSelect = styled.select`
  padding: 12px;
  background-color: #2c2c2c;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 16px;
  color: white;
  width: 155px;
  margin-right: 10px;
`

const CategoryDropdown = ({categories, onChange}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value)
    onChange(event.target.value) // Trigger the passed onChange function
  }

  return (
    <DropdownWrapper>
      <StyledSelect
        id="category-select"
        value={selectedCategory}
        onChange={handleCategoryChange}>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </StyledSelect>
    </DropdownWrapper>
  )
}

export default CategoryDropdown
