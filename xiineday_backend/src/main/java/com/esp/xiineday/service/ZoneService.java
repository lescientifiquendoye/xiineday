package com.esp.xiineday.service;

import com.esp.xiineday.model.Zone;
import java.util.List;

public interface ZoneService {
    List<Zone> findAll();
    Zone findById(Long id);
    Zone save(Zone e);
    void delete(Long id);
}
