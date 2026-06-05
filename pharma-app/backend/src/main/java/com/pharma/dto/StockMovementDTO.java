package com.pharma.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StockMovementDTO {

    private Integer movementId;

    @NotNull(message = "Drug ID is required")
    private Integer drugId;

    private String drugName;
    private String movementType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private LocalDateTime movementDate;
    private String performedBy;
    private String remarks;
	public Integer getDrugId() {
		// TODO Auto-generated method stub
		return null;
	}
	public int getQuantity() {
		// TODO Auto-generated method stub
		return 0;
	}
	public Integer getMovementId() {
		return movementId;
	}
	public void setMovementId(Integer movementId) {
		this.movementId = movementId;
	}
	public String getDrugName() {
		return drugName;
	}
	public void setDrugName(String drugName) {
		this.drugName = drugName;
	}
	public String getMovementType() {
		return movementType;
	}
	public void setMovementType(String movementType) {
		this.movementType = movementType;
	}
	public LocalDateTime getMovementDate() {
		return movementDate;
	}
	public void setMovementDate(LocalDateTime movementDate) {
		this.movementDate = movementDate;
	}
	public String getPerformedBy() {
		return performedBy;
	}
	public void setPerformedBy(String performedBy) {
		this.performedBy = performedBy;
	}
	public void setDrugId(Integer drugId) {
		this.drugId = drugId;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public Object getRemarks() {
		// TODO Auto-generated method stub
		return null;
	}
}
