package com.esp.xiineday.controller;

import com.esp.xiineday.model.EventType;
import com.esp.xiineday.service.EventTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventTypeController {

    private final EventTypeService eventTypeService;

    public EventTypeController(EventTypeService eventTypeService) {
        this.eventTypeService = eventTypeService;
    }

    @GetMapping
    public List<EventType> getAll() {
        return eventTypeService.findAll();
    }

    @GetMapping("/{id}")
    public EventType getById(@PathVariable Long id) {
        return eventTypeService.findById(id);
    }

    @PostMapping
    public EventType create(@RequestBody EventType eventType) {
        return eventTypeService.save(eventType);
    }

    @PutMapping("/{id}")
    public EventType update(@PathVariable Long id, @RequestBody EventType eventType) {
        eventType.setId(id);
        return eventTypeService.save(eventType);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        eventTypeService.delete(id);
    }
}
