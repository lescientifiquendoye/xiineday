package com.esp.xiineday.service;

import com.esp.xiineday.model.Crop;
import java.util.List;

public interface CropService {
    List<Crop> findAll();
    Crop findById(Long id);
    Crop save(Crop e);
    void delete(Long id);
}
