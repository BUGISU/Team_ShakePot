package com.example.api.repository;

import com.example.api.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
  Company findByEmail(String email);
}
