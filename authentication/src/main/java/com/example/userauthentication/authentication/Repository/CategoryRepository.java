package com.example.userauthentication.authentication.Repository;

import com.example.userauthentication.authentication.Models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// import com.example.userauthentication.authentication.Models.AbstractCategoryModels.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {}
