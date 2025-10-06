package com.esp.xiineday.service.impl;

import com.esp.xiineday.model.Zone;
import com.esp.xiineday.repository.ZoneRepository;
import com.esp.xiineday.service.ZoneService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneServiceImpl implements ZoneService {

    private final ZoneRepository repository;

    public ZoneServiceImpl(ZoneRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Zone> findAll() {
        return repository.findAll();
    }

    @Override
    public Zone findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Zone save(Zone e) {
        return repository.save(e);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
