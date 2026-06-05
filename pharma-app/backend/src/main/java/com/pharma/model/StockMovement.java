package com.pharma.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.pharma.dto.StockMovementDTO;

@Entity
@Table(name = "tbl_stock_movements")
@Data
@NoArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    private Integer movementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_id", nullable = false)
    private Drug drug;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private MovementType movementType;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "movement_date", nullable = false)
    private LocalDateTime movementDate;

    @Column(name = "performed_by", length = 100)
    private String performedBy;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @PrePersist
    public void prePersist() {
        if (this.movementDate == null) {
            this.movementDate = LocalDateTime.now();
        }
    }

    public enum MovementType {
        IN, OUT
    }

	public void setDrug(Drug drug2) {
		// TODO Auto-generated method stub
		
	}

	public void setMovementType(MovementType in) {
		// TODO Auto-generated method stub
		
	}

	public void setQuantity(int quantity2) {
		// TODO Auto-generated method stub
		
	}

	public void setPerformedBy(String performedBy2) {
		// TODO Auto-generated method stub
		
	}

	public void setRemarks(Object remarks2) {
		// TODO Auto-generated method stub
		
	}

	public Integer getMovementId() {
		// TODO Auto-generated method stub
		return null;
	}

	public StockMovementDTO getDrug() {
		// TODO Auto-generated method stub
		return null;
	}

	public Enum<MovementType> getMovementType() {
		// TODO Auto-generated method stub
		return null;
	}

	public Integer getQuantity() {
		// TODO Auto-generated method stub
		return null;
	}

	public LocalDateTime getMovementDate() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getPerformedBy() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getRemarks() {
		// TODO Auto-generated method stub
		return null;
	}

	public Integer getMovementId1() {
		// TODO Auto-generated method stub
		return null;
	}
}
