package com.esp.xiineday.repository;

import com.esp.xiineday.model.IdealConditions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdealConditionsRepository extends JpaRepository<IdealConditions, Long> {
}
