package com.pharma.repository;

import com.pharma.model.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Integer> {

    Page<StockMovement> findAllByOrderByMovementDateDesc(Pageable pageable);

    Page<StockMovement> findByDrug_DrugIdOrderByMovementDateDesc(Integer drugId, Pageable pageable);

    List<StockMovement> findByDrug_DrugIdOrderByMovementDateDesc(Integer drugId);
}
