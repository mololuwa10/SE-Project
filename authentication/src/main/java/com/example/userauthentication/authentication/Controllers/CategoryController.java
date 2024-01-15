package com.example.userauthentication.authentication.Controllers;

import com.example.userauthentication.authentication.Models.Category;
import com.example.userauthentication.authentication.Repository.CategoryRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
  origins = { "http://localhost:3000" },
  methods = {
    RequestMethod.OPTIONS,
    RequestMethod.GET,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.POST,
  }
)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  @Autowired
  private CategoryRepository categoryRepository;

  @GetMapping
  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Category> getCategoryById(
    @PathVariable(value = "id") Long categoryId
  ) {
    if (categoryId == null) {
      return ResponseEntity.badRequest().build();
    }
    Optional<Category> category = categoryRepository.findById(categoryId);
    if (category.isPresent()) {
      return ResponseEntity.ok().body(category.get());
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @PostMapping
  public Category addCategory(@RequestBody Category category) {
    if (category == null) {
      throw new IllegalArgumentException("category cannot be null");
    }
    return categoryRepository.save(category);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Category> updateCategory(
    @PathVariable(value = "id") Long categoryId,
    @RequestBody Category categoryDetails
  ) {
    if (categoryId == null) {
      return ResponseEntity.badRequest().build();
    }
    Optional<Category> category = categoryRepository.findById(categoryId);
    if (category.isPresent()) {
      Category updatedCategory = category.get();
      updatedCategory.setCategoryName(categoryDetails.getCategoryName());
      categoryRepository.save(updatedCategory);
      return ResponseEntity.ok().body(updatedCategory);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCategory(
    @PathVariable(value = "id") Long categoryId
  ) {
    if (categoryId == null) {
      return ResponseEntity.badRequest().build();
    }
    Optional<Category> category = categoryRepository.findById(categoryId);

    if (category.isPresent() && category != null) {
      categoryRepository.delete(category.get());
      return ResponseEntity.ok().build();
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }
}
