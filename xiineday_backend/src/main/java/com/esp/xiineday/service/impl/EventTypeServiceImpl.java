package com.esp.xiineday.service.impl;

import com.esp.xiineday.model.EventType;
import com.esp.xiineday.repository.EventTypeRepository;
import com.esp.xiineday.service.EventTypeService;

import java.util.List;

public class EventTypeServiceImpl implements EventTypeService {

    private final EventTypeRepository repository;

    public EventTypeServiceImpl(EventTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<EventType> findAll() {
        return repository.findAll();
    }

    @Override
    public EventType findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public EventType save(EventType e) {
        return repository.save(e);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
