package com.pharma.controller;

import com.pharma.dto.DrugDTO;
import com.pharma.service.DrugService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    private final DrugService drugService;

    public DrugController(DrugService drugService) {
        this.drugService = drugService;
    }

    @GetMapping
    public ResponseEntity<Page<DrugDTO>> getAllDrugs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(drugService.getAllDrugs(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DrugDTO>> searchDrugs(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(drugService.searchDrugs(name, category, expiryFrom, expiryTo, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDrugById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(drugService.getDrugById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createDrug(@Valid @RequestBody DrugDTO dto) {
        try {
            DrugDTO created = drugService.createDrug(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDrug(@PathVariable Integer id, @Valid @RequestBody DrugDTO dto) {
        try {
            return ResponseEntity.ok(drugService.updateDrug(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDrug(@PathVariable Integer id) {
        try {
            drugService.deleteDrug(id);
            return ResponseEntity.ok(Map.of("message", "Drug deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
