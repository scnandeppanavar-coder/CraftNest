package com.handmadecrafts.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.handmadecrafts.backend.dto.CategoryDto;
import com.handmadecrafts.backend.dto.ProductDto;
import com.handmadecrafts.backend.dto.ProductImageDto;
import com.handmadecrafts.backend.entity.Category;
import com.handmadecrafts.backend.entity.Product;
import com.handmadecrafts.backend.entity.ProductImage;
import com.handmadecrafts.backend.exception.ResourceNotFoundException;
import com.handmadecrafts.backend.repository.CategoryRepository;
import com.handmadecrafts.backend.repository.ProductImageRepository;
import com.handmadecrafts.backend.repository.ProductRepository;
import com.handmadecrafts.backend.repository.ReviewRepository;
import com.handmadecrafts.backend.specification.ProductSpecification;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository, 
                          ProductImageRepository productImageRepository,
                          CategoryRepository categoryRepository,
                          ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ProductDto> getAllProducts() {

    List<Product> products = productRepository.findAll();

    System.out.println("TOTAL PRODUCTS = " + products.size());

    return convertToDtoList(products);
}
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return convertToDto(product);
    }

    public List<ProductDto> getProductsByCategory(Integer categoryId) {
        List<Product> products = productRepository.findByCategoryCategoryIdAndActiveTrue(categoryId);
        return convertToDtoList(products);
    }

    public List<ProductDto> searchProducts(String keyword) {
        return filterProducts(keyword, null, null, null, "name");
    }

    public List<ProductDto> filterProducts(
            String keyword,
            Integer categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy) {

        Specification<Product> specification = ProductSpecification.filterProducts(
                keyword,
                categoryId,
                minPrice,
                maxPrice,
                null); // Only active products for customers

        Sort sort = Sort.unsorted();

        if ("priceAsc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").ascending();
        } else if ("priceDesc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").descending();
        } else if ("name".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("name").ascending();
        }

        List<Product> products = productRepository.findAll(specification, sort);
        return convertToDtoList(products);
    }

    public List<ProductImageDto> getProductImages(Integer productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with ID: " + productId);
        }
        return productImageRepository.findByProductProductId(productId).stream()
                .map(this::convertToImageDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Category category = null;
        if (productDto.getCategory() != null && productDto.getCategory().getCategoryId() != null) {
            category = categoryRepository.findById(productDto.getCategory().getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .stock(productDto.getStock())
                .category(category)
                .createdAt(java.time.LocalDate.now())
                .updatedAt(java.time.LocalDate.now())
                .active(productDto.getActive() != null ? productDto.getActive() : true)
                .build();

        product = productRepository.save(product);

        if (productDto.getImages() != null) {
            for (ProductImageDto imgDto : productDto.getImages()) {
                ProductImage img = ProductImage.builder()
                        .product(product)
                        .imageUrl(imgDto.getImageUrl())
                        .isPrimary(imgDto.getIsPrimary() != null ? imgDto.getIsPrimary() : false)
                        .build();
                productImageRepository.save(img);
            }
        }

        return convertToDto(product);
    }

    @Transactional
    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        Category category = null;
        if (productDto.getCategory() != null && productDto.getCategory().getCategoryId() != null) {
            category = categoryRepository.findById(productDto.getCategory().getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setCategory(category);
        product.setUpdatedAt(java.time.LocalDate.now());
        if (productDto.getActive() != null) {
            product.setActive(productDto.getActive());
        }

        product = productRepository.save(product);

        // Replace existing images
        List<ProductImage> existingImages = productImageRepository.findByProductProductId(id);
        productImageRepository.deleteAll(existingImages);

        if (productDto.getImages() != null) {
            for (ProductImageDto imgDto : productDto.getImages()) {
                ProductImage img = ProductImage.builder()
                        .product(product)
                        .imageUrl(imgDto.getImageUrl())
                        .isPrimary(imgDto.getIsPrimary() != null ? imgDto.getIsPrimary() : false)
                        .build();
                productImageRepository.save(img);
            }
        }

        return convertToDto(product);
    }

    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        List<ProductImage> images = productImageRepository.findByProductProductId(id);
        productImageRepository.deleteAll(images);

        productRepository.delete(product);
    }

    public List<ProductDto> getAllProductsForAdmin() {
        List<Product> products = productRepository.findAll();
        return convertToDtoList(products);
    }

    private List<ProductDto> convertToDtoList(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return new java.util.ArrayList<>();
        }

        List<Integer> productIds = products.stream()
                .map(Product::getProductId)
                .collect(Collectors.toList());

        List<ProductImage> allImages = productImageRepository.findByProductProductIdIn(productIds);
        java.util.Map<Integer, List<ProductImage>> imagesByProductId = allImages.stream()
                .collect(Collectors.groupingBy(img -> img.getProduct().getProductId()));

        List<Object[]> reviewStatsList = reviewRepository.getReviewStatsForAllProducts();
        java.util.Map<Integer, Double> avgRatings = new java.util.HashMap<>();
        java.util.Map<Integer, Long> totalReviews = new java.util.HashMap<>();
        for (Object[] row : reviewStatsList) {
            Integer prodId = (Integer) row[0];
            Double avg = (Double) row[1];
            Long count = (Long) row[2];
            avgRatings.put(prodId, avg);
            totalReviews.put(prodId, count);
        }

        return products.stream()
                .map(product -> {
                    List<ProductImage> images = imagesByProductId.getOrDefault(product.getProductId(), new java.util.ArrayList<>());
                    Double avgRating = avgRatings.getOrDefault(product.getProductId(), 0.0);
                    Integer totalReview = totalReviews.getOrDefault(product.getProductId(), 0L).intValue();
                    return convertToDto(product, images, avgRating, totalReview);
                })
                .collect(Collectors.toList());
    }

    private ProductDto convertToDto(Product product, List<ProductImage> images, Double avgRating, Integer totalReviews) {
        CategoryDto categoryDto = null;
        if (product.getCategory() != null) {
            Category category = product.getCategory();
            categoryDto = CategoryDto.builder()
                    .categoryId(category.getCategoryId())
                    .categoryName(category.getCategoryName())
                    .build();
        }

        String imageUrl = null;
        if (images != null && !images.isEmpty()) {
            imageUrl = images.stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(images.get(0).getImageUrl());
        }

        List<ProductImageDto> imageDtos = new java.util.ArrayList<>();
        if (images != null) {
            imageDtos = images.stream()
                    .map(this::convertToImageDto)
                    .collect(Collectors.toList());
        }

        return ProductDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(categoryDto)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .imageUrl(imageUrl)
                .active(product.getActive())
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0)
                .images(imageDtos)
                .build();
    }

    private ProductDto convertToDto(Product product) {
        CategoryDto categoryDto = null;
        if (product.getCategory() != null) {
            Category category = product.getCategory();
            categoryDto = CategoryDto.builder()
                    .categoryId(category.getCategoryId())
                    .categoryName(category.getCategoryName())
                    .build();
        }

        List<ProductImage> images = productImageRepository.findByProductProductId(product.getProductId());
        String imageUrl = null;
        if (!images.isEmpty()) {
            imageUrl = images.stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(images.get(0).getImageUrl());
        }

        List<ProductImageDto> imageDtos = images.stream()
                .map(this::convertToImageDto)
                .collect(Collectors.toList());

        Double avgRating = reviewRepository.getAverageRatingForProduct(product.getProductId());
        Integer totalReviews = reviewRepository.getTotalReviewsForProduct(product.getProductId());

        return ProductDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(categoryDto)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .imageUrl(imageUrl)
                .active(product.getActive())
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0)
                .images(imageDtos)
                .build();
    }

    private ProductImageDto convertToImageDto(ProductImage image) {
        return ProductImageDto.builder()
                .imageId(image.getImageId())
                .productId(image.getProduct() != null ? image.getProduct().getProductId() : null)
                .imageUrl(image.getImageUrl())
                .isPrimary(image.getIsPrimary())
                .build();
    }
}
