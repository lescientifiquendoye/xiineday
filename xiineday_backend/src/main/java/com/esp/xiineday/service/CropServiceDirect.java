package com.esp.xiineday.service;

import com.esp.xiineday.model.Crop;
import com.esp.xiineday.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropServiceDirect implements CropService {

    private final CropRepository repository;

    public CropServiceDirect(CropRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Crop> findAll() {
        return repository.findAll();
    }

    @Override
    public Crop findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Crop save(Crop e) {
        return repository.save(e);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
