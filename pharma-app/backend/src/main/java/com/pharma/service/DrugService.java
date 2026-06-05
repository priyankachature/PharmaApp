package com.pharma.service;

import com.pharma.dto.DrugDTO;
import com.pharma.model.Drug;
import com.pharma.repository.DrugRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DrugService {

    private final DrugRepository drugRepository;

    public DrugService(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    public Page<DrugDTO> getAllDrugs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("drugName").ascending());
        return drugRepository.findAll(pageable).map(this::toDTO);
    }

    public Page<DrugDTO> searchDrugs(String name, String category,
                                      LocalDate expiryFrom, LocalDate expiryTo,
                                      int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("expiryDate").ascending());
        return drugRepository.searchDrugs(
                (name != null && name.isBlank()) ? null : name,
                (category != null && category.isBlank()) ? null : category,
                expiryFrom, expiryTo, pageable
        ).map(this::toDTO);
    }

    public DrugDTO getDrugById(Integer id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        return toDTO(drug);
    }

    @Transactional
    public DrugDTO createDrug(DrugDTO dto) {
        Drug drug = toEntity(dto);
        return toDTO(drugRepository.save(drug));
    }

    @Transactional
    public DrugDTO updateDrug(Integer id, DrugDTO dto) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
        drug.setDrugName(dto.getDrugName());
        drug.setGenericName(dto.getGenericName());
        drug.setCategory(dto.getCategory());
        drug.setManufacturer(dto.getManufacturer());
        drug.setBatchNumber(dto.getBatchNumber());
        drug.setMfgDate(dto.getMfgDate());
        drug.setExpiryDate(dto.getExpiryDate());
        drug.setUom(dto.getUom());
        drug.setQtyInStock(dto.getQtyInStock());
        drug.setReorderLevel(dto.getReorderLevel());
        drug.setStorageCondition(dto.getStorageCondition());
        return toDTO(drugRepository.save(drug));
    }

    @Transactional
    public void deleteDrug(Integer id) {
        if (!drugRepository.existsById(id)) {
            throw new RuntimeException("Drug not found with id: " + id);
        }
        drugRepository.deleteById(id);
    }

    public List<DrugDTO> getExpiryReport(int days) {
        LocalDate threshold = LocalDate.now().plusDays(days);
        return drugRepository.findExpiringWithin(threshold)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<DrugDTO> getLowStockReport() {
        return drugRepository.findLowStockDrugs()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DrugDTO toDTO(Drug drug) {
        DrugDTO dto = new DrugDTO();
        dto.setDrugId(drug.getDrugId());
        dto.setDrugName(drug.getDrugName());
        dto.setGenericName(drug.getGenericName());
        dto.setCategory(drug.getCategory());
        dto.setManufacturer(drug.getManufacturer());
        dto.setBatchNumber(drug.getBatchNumber());
        dto.setMfgDate(drug.getMfgDate());
        dto.setExpiryDate(drug.getExpiryDate());
        dto.setUom(drug.getUom());
        dto.setQtyInStock(drug.getQtyInStock());
        dto.setReorderLevel(drug.getReorderLevel());
        dto.setStorageCondition(drug.getStorageCondition());
        dto.setCreatedAt(drug.getCreatedAt());
        dto.setExpiryStatus(computeExpiryStatus(drug.getExpiryDate()));
        dto.setLowStock(drug.getQtyInStock() <= drug.getReorderLevel());
        return dto;
    }

    private Drug toEntity(DrugDTO dto) {
        Drug drug = new Drug();
        drug.setDrugName(dto.getDrugName());
        drug.setGenericName(dto.getGenericName());
        drug.setCategory(dto.getCategory());
        drug.setManufacturer(dto.getManufacturer());
        drug.setBatchNumber(dto.getBatchNumber());
        drug.setMfgDate(dto.getMfgDate());
        drug.setExpiryDate(dto.getExpiryDate());
        drug.setUom(dto.getUom());
        drug.setQtyInStock(dto.getQtyInStock() != null ? dto.getQtyInStock() : 0);
        drug.setReorderLevel(dto.getReorderLevel() != null ? dto.getReorderLevel() : 0);
        drug.setStorageCondition(dto.getStorageCondition());
        return drug;
    }

    public static String computeExpiryStatus(LocalDate expiryDate) {
        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) return "EXPIRED";
        if (!expiryDate.isAfter(today.plusDays(7))) return "CRITICAL";
        if (!expiryDate.isAfter(today.plusDays(30))) return "WARNING";
        return "OK";
    }
}
