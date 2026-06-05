package com.pharma.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_drugs")
@Data
@NoArgsConstructor
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drug_id")
    private Integer drugId;

    @Column(name = "drug_name", nullable = false, length = 150)
    private String drugName;

    @Column(name = "generic_name", length = 150)
    private String genericName;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "manufacturer", length = 150)
    private String manufacturer;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(name = "mfg_date")
    private LocalDate mfgDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "uom", length = 30)
    private String uom;

    @Column(name = "qty_in_stock", nullable = false)
    private Integer qtyInStock = 0;

    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 0;

    @Column(name = "storage_condition", length = 200)
    private String storageCondition;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
