package com.esp.xiineday.repository;

import com.esp.xiineday.model.GrowthStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrowthStageRepository extends JpaRepository<GrowthStage, Long> {
}
