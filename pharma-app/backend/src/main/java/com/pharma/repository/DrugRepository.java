package com.pharma.repository;

import com.pharma.model.Drug;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DrugRepository extends JpaRepository<Drug, Integer> {

    Page<Drug> findAll(Pageable pageable);

    @Query("SELECT d FROM Drug d WHERE " +
           "(:name IS NULL OR LOWER(d.drugName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(d.genericName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR LOWER(d.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:expiryFrom IS NULL OR d.expiryDate >= :expiryFrom) AND " +
           "(:expiryTo IS NULL OR d.expiryDate <= :expiryTo)")
    Page<Drug> searchDrugs(@Param("name") String name,
                           @Param("category") String category,
                           @Param("expiryFrom") LocalDate expiryFrom,
                           @Param("expiryTo") LocalDate expiryTo,
                           Pageable pageable);

    @Query("SELECT COUNT(d) FROM Drug d WHERE d.expiryDate < :today")
    long countExpired(@Param("today") LocalDate today);

    @Query("SELECT COUNT(d) FROM Drug d WHERE d.expiryDate >= :today AND d.expiryDate <= :criticalDate")
    long countCritical(@Param("today") LocalDate today, @Param("criticalDate") LocalDate criticalDate);

    @Query("SELECT COUNT(d) FROM Drug d WHERE d.expiryDate > :criticalDate AND d.expiryDate <= :warningDate")
    long countWarning(@Param("criticalDate") LocalDate criticalDate, @Param("warningDate") LocalDate warningDate);

    @Query("SELECT COUNT(d) FROM Drug d WHERE d.qtyInStock <= d.reorderLevel")
    long countLowStock();

    @Query("SELECT d FROM Drug d WHERE d.expiryDate <= :thresholdDate ORDER BY d.expiryDate ASC")
    List<Drug> findExpiringWithin(@Param("thresholdDate") LocalDate thresholdDate);

    @Query("SELECT d FROM Drug d WHERE d.qtyInStock <= d.reorderLevel ORDER BY d.qtyInStock ASC")
    List<Drug> findLowStockDrugs();
}
