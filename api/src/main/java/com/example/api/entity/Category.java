package com.example.api.entity;

public enum Category {
  TASTE,    // 맛 관련 필터
  SUGAR,    // 당 함량 필터
  PROTEIN,  // 단백질 필터
  CALORIE,  // 칼로리 필터
  RECOMMENDED  // 추천순 필터
}


//리액트에서 사용될 수 있음 주석처리
//import React, { useState, useEffect } from 'react';
//
//    const CategoryPage = ({ category }) => {
//    const [filter, setFilter] = useState('');
//  const [products, setProducts] = useState([]);
//
//useEffect(() => {
//fetchProducts();
//  }, [category, filter]);
//
//    const fetchProducts = async () => {
//    const response = await fetch(`/api/products?category=${category}&filter=${filter}`);
//    const data = await response.json();
//setProducts(data);
//  };
//
//      const renderFilterOptions = () => {
//    switch (category) {
//    case 'Taste':
//    return (
//          <select onChange={(e) => setFilter(e.target.value)}>
//            <option value="">추천순</option>
//            <option value="초코맛">초코맛</option>
//            <option value="과일맛">과일맛</option>
//            <option value="쿠키앤크림맛">쿠키앤크림맛</option>
//          </select>
//    );
//    case 'Sugar':
//    return (
//          <select onChange={(e) => setFilter(e.target.value)}>
//            <option value="">추천순</option>
//            <option value="당 5g 이하">당 5g 이하</option>
//            <option value="당 6g-10g">당 6g-10g</option>
//            <option value="당 11g 이상">당 11g 이상</option>
//          </select>
//    );
//    case 'Protein':
//    return (
//          <select onChange={(e) => setFilter(e.target.value)}>
//            <option value="">추천순</option>
//            <option value="단백질 20g 이상">단백질 20g 이상</option>
//            <option value="단백질 10g-19g">단백질 10g-19g</option>
//            <option value="단백질 9g 이하">단백질 9g 이하</option>
//          </select>
//    );
//    case 'Calorie':
//    return (
//          <select onChange={(e) => setFilter(e.target.value)}>
//            <option value="">추천순</option>
//            <option value="칼로리 200kcal 이하">칼로리 200kcal 이하</option>
//            <option value="칼로리 201kcal 이상">칼로리 201kcal 이상</option>
//          </select>
//    );
//default:
//    return null;
//    }
//    };
//
//    return (
//    <div>
//<h1>{category}</h1>
//    {renderFilterOptions()}
//<div>
//{products.map((product) => (
//    <div key={product.id}>
//            <h3>{product.name}</h3>
//            <p>{product.price}</p>
//          </div>
//        ))}
//      </div>
//    </div>
//    );
//    };
//
//export default CategoryPage;
