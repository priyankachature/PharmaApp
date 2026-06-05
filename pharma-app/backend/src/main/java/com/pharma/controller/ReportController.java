package com.pharma.controller;

import com.pharma.dto.DashboardDTO;
import com.pharma.dto.DrugDTO;
import com.pharma.service.DrugService;
import com.pharma.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReportController {

    private final ReportService reportService;
    private final DrugService drugService;

    public ReportController(ReportService reportService, DrugService drugService) {
        this.reportService = reportService;
        this.drugService = drugService;
    }

    @GetMapping("/api/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(reportService.getDashboardSummary());
    }

    @GetMapping("/api/reports/expiry")
    public ResponseEntity<List<DrugDTO>> getExpiryReport(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(drugService.getExpiryReport(days));
    }

    @GetMapping("/api/reports/low-stock")
    public ResponseEntity<List<DrugDTO>> getLowStockReport() {
        return ResponseEntity.ok(drugService.getLowStockReport());
    }
}
