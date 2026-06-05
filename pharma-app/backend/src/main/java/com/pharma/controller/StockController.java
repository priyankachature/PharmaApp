package com.pharma.controller;

import com.pharma.dto.StockMovementDTO;
import com.pharma.service.StockService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/in")
    public ResponseEntity<?> stockIn(@Valid @RequestBody StockMovementDTO dto,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails != null ? userDetails.getUsername() : "system";
            return ResponseEntity.ok(stockService.stockIn(dto, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/out")
    public ResponseEntity<?> stockOut(@Valid @RequestBody StockMovementDTO dto,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails != null ? userDetails.getUsername() : "system";
            return ResponseEntity.ok(stockService.stockOut(dto, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<Page<StockMovementDTO>> getHistory(
            @RequestParam(required = false) Integer drugId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(stockService.getHistory(drugId, page, size));
    }
}
