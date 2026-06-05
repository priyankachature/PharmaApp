package com.pharma.service;

import com.pharma.dto.DashboardDTO;
import com.pharma.repository.DrugRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ReportService {

    private final DrugRepository drugRepository;

    public ReportService(DrugRepository drugRepository) {
        this.drugRepository = drugRepository;
    }

    public DashboardDTO getDashboardSummary() {
        LocalDate today = LocalDate.now();
        LocalDate criticalDate = today.plusDays(7);
        LocalDate warningDate = today.plusDays(30);

        long total = drugRepository.count();
        long expired = drugRepository.countExpired(today);
        long critical = drugRepository.countCritical(today, criticalDate);
        long warning = drugRepository.countWarning(criticalDate, warningDate);
        long lowStock = drugRepository.countLowStock();

        return new DashboardDTO(total, expired, critical, warning, lowStock);
    }
}
