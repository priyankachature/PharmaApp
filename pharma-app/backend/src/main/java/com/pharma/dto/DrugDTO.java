package com.pharma.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DrugDTO {

    private Integer drugId;

    @NotBlank(message = "Drug name is required")
    private String drugName;

    private String genericName;
    private String category;
    private String manufacturer;
    public Integer getDrugId() {
		return drugId;
	}
	public void setDrugId(Integer drugId) {
		this.drugId = drugId;
	}
	public String getDrugName() {
		return drugName;
	}
	public void setDrugName(String drugName) {
		this.drugName = drugName;
	}
	public String getGenericName() {
		return genericName;
	}
	public void setGenericName(String genericName) {
		this.genericName = genericName;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public String getBatchNumber() {
		return batchNumber;
	}
	public void setBatchNumber(String batchNumber) {
		this.batchNumber = batchNumber;
	}
	public LocalDate getMfgDate() {
		return mfgDate;
	}
	public void setMfgDate(LocalDate mfgDate) {
		this.mfgDate = mfgDate;
	}
	public LocalDate getExpiryDate() {
		return expiryDate;
	}
	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}
	public String getUom() {
		return uom;
	}
	public void setUom(String uom) {
		this.uom = uom;
	}
	public Integer getQtyInStock() {
		return qtyInStock;
	}
	public void setQtyInStock(Integer qtyInStock) {
		this.qtyInStock = qtyInStock;
	}
	public Integer getReorderLevel() {
		return reorderLevel;
	}
	public void setReorderLevel(Integer reorderLevel) {
		this.reorderLevel = reorderLevel;
	}
	public String getStorageCondition() {
		return storageCondition;
	}
	public void setStorageCondition(String storageCondition) {
		this.storageCondition = storageCondition;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public String getExpiryStatus() {
		return expiryStatus;
	}
	public void setExpiryStatus(String expiryStatus) {
		this.expiryStatus = expiryStatus;
	}
	public boolean isLowStock() {
		return lowStock;
	}
	public void setLowStock(boolean lowStock) {
		this.lowStock = lowStock;
	}
	private String batchNumber;
    private LocalDate mfgDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private String uom;

    @NotNull(message = "Quantity in stock is required")
    private Integer qtyInStock;

    @NotNull(message = "Reorder level is required")
    private Integer reorderLevel;

    private String storageCondition;
    private LocalDateTime createdAt;

    // Computed status for frontend color coding
    private String expiryStatus; // EXPIRED, CRITICAL, WARNING, OK
    private boolean lowStock;
}
