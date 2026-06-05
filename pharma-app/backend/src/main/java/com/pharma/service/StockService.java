package com.pharma.service;

import com.pharma.dto.StockMovementDTO;
import com.pharma.model.Drug;
import com.pharma.model.StockMovement;
import com.pharma.repository.DrugRepository;
import com.pharma.repository.StockMovementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StockService {

    private final StockMovementRepository movementRepository;
    private final DrugRepository drugRepository;

    public StockService(StockMovementRepository movementRepository, DrugRepository drugRepository) {
        this.movementRepository = movementRepository;
        this.drugRepository = drugRepository;
    }

    @Transactional
    public StockMovementDTO stockIn(StockMovementDTO dto, String performedBy) {
        Drug drug = drugRepository.findById(dto.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + dto.getDrugId()));

        drug.setQtyInStock(drug.getQtyInStock() + dto.getQuantity());
        drugRepository.save(drug);

        StockMovement movement = new StockMovement();
        movement.setDrug(drug);
        movement.setMovementType(StockMovement.MovementType.IN);
        movement.setQuantity(dto.getQuantity());
        movement.setPerformedBy(performedBy);
        movement.setRemarks(dto.getRemarks());

        return toDTO(movementRepository.save(movement));
    }

    @Transactional
    public StockMovementDTO stockOut(StockMovementDTO dto, String performedBy) {
        Drug drug = drugRepository.findById(dto.getDrugId())
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + dto.getDrugId()));

        if (drug.getQtyInStock() < dto.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + drug.getQtyInStock()
                    + ", Requested: " + dto.getQuantity());
        }

        drug.setQtyInStock(drug.getQtyInStock() - dto.getQuantity());
        drugRepository.save(drug);

        StockMovement movement = new StockMovement();
        movement.setDrug(drug);
        movement.setMovementType(StockMovement.MovementType.OUT);
        movement.setQuantity(dto.getQuantity());
        movement.setPerformedBy(performedBy);
        movement.setRemarks(dto.getRemarks());

        return toDTO(movementRepository.save(movement));
    }

    public Page<StockMovementDTO> getHistory(Integer drugId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (drugId != null) {
            return movementRepository
                    .findByDrug_DrugIdOrderByMovementDateDesc(drugId, pageable)
                    .map(this::toDTO);
        }
        return movementRepository.findAllByOrderByMovementDateDesc(pageable).map(this::toDTO);
    }

    private StockMovementDTO toDTO(StockMovement m) {
        StockMovementDTO dto = new StockMovementDTO();
        dto.setMovementId(m.getMovementId());
        dto.setDrugId(m.getDrug().getDrugId());
        dto.setDrugName(m.getDrug().getDrugName());
        dto.setMovementType(m.getMovementType().name());
        dto.setQuantity(m.getQuantity());
        dto.setMovementDate(m.getMovementDate());
        dto.setPerformedBy(m.getPerformedBy());
        dto.setRemarks(m.getRemarks());
        return dto;
    }
}
