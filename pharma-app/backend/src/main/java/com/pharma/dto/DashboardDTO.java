package com.pharma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
   
	private long totalDrugs;
    private long expiredCount;
    private long criticalCount;   // <= 7 days
    private long warningCount;    // <= 30 days
    private long lowStockCount;
}
