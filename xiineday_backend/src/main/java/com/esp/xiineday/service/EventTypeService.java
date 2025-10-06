package com.esp.xiineday.service;

import com.esp.xiineday.model.EventType;
import java.util.List;

public interface EventTypeService {
    List<EventType> findAll();
    EventType findById(Long id);
    EventType save(EventType e);
    void delete(Long id);
}
