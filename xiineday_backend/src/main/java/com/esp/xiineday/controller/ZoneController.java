package com.esp.xiineday.controller;

import com.esp.xiineday.model.Zone;
import com.esp.xiineday.service.ZoneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    public List<Zone> getAll() {
        return zoneService.findAll();
    }

    @GetMapping("/{id}")
    public Zone getById(@PathVariable Long id) {
        return zoneService.findById(id);
    }

    @PostMapping
    public Zone create(@RequestBody Zone zone) {
        return zoneService.save(zone);
    }

    @PutMapping("/{id}")
    public Zone update(@PathVariable Long id, @RequestBody Zone zone) {
        zone.setId(id);
        return zoneService.save(zone);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        zoneService.delete(id);
    }
}
