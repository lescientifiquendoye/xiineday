package com.esp.xiineday.service;

import com.esp.xiineday.model.EventType;
import com.esp.xiineday.repository.EventTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventTypeServiceDirect implements EventTypeService {

    private final EventTypeRepository repository;

    public EventTypeServiceDirect(EventTypeRepository repository) {
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
