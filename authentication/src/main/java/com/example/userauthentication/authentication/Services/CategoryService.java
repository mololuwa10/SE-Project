package com.example.userauthentication.authentication.Services;

import com.example.userauthentication.authentication.Models.Category;
import com.example.userauthentication.authentication.Repository.CategoryRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  public Optional<Category> getCategoryById(Long categoryId) {
    if (categoryId == null) {
      return Optional.empty();
    }
    return categoryRepository.findById(categoryId);
  }

  public Category addCategory(Category category) {
    if (category == null) {
      return null;
    }
    return categoryRepository.save(category);
  }

  public Optional<Category> updateCategory(
    Long categoryId,
    Category categoryDetails
  ) {
    if (categoryId == null || categoryDetails == null) {
      return Optional.empty();
    }
    Optional<Category> category = categoryRepository.findById(categoryId);
    if (category.isPresent()) {
      Category updatedCategory = category.get();
      updatedCategory.setCategoryName(categoryDetails.getCategoryName());
      categoryRepository.save(updatedCategory);
      return Optional.of(updatedCategory);
    } else {
      return Optional.empty();
    }
  }

  public boolean deleteCategory(Long categoryId) {
    if (categoryId == null) {
      return false;
    }
    Optional<Category> category = categoryRepository.findById(categoryId);
    if (category.isPresent()) {
      categoryRepository.delete(category.get());
      return true;
    } else {
      return false;
    }
  }
}
