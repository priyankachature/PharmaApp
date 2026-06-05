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

	public int getQtyInStock() {
		// TODO Auto-generated method stub
		return 0;
	}

	public void setQtyInStock(int i) {
		// TODO Auto-generated method stub
		
	}

	public void setStorageCondition(String storageCondition2) {
		// TODO Auto-generated method stub
		
	}

	public void setReorderLevel(Integer reorderLevel2) {
		// TODO Auto-generated method stub
		
	}

	public void setDrugName(String drugName2) {
		// TODO Auto-generated method stub
		
	}

	public void setGenericName(String genericName2) {
		// TODO Auto-generated method stub
		
	}

	public void setCategory(String category2) {
		// TODO Auto-generated method stub
		
	}

	public void setManufacturer(String manufacturer2) {
		// TODO Auto-generated method stub
		
	}

	public void setBatchNumber(String batchNumber2) {
		// TODO Auto-generated method stub
		
	}

	public void setMfgDate(LocalDate mfgDate2) {
		// TODO Auto-generated method stub
		
	}

	public void setExpiryDate(LocalDate expiryDate2) {
		// TODO Auto-generated method stub
		
	}

	public void setUom(String uom2) {
		// TODO Auto-generated method stub
		
	}

	public Integer getDrugId() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getDrugName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getGenericName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getCategory() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getManufacturer() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getBatchNumber() {
		// TODO Auto-generated method stub
		return null;
	}

	public LocalDate getMfgDate() {
		// TODO Auto-generated method stub
		return null;
	}

	public LocalDate getExpiryDate() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getUom() {
		// TODO Auto-generated method stub
		return null;
	}

	public Integer getReorderLevel() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getStorageCondition() {
		// TODO Auto-generated method stub
		return null;
	}

	public LocalDateTime getCreatedAt() {
		// TODO Auto-generated method stub
		return null;
	}
}
