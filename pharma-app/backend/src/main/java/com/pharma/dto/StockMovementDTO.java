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
}
