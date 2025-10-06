package com.esp.xiineday.controller;

import com.esp.xiineday.model.Crop;
import com.esp.xiineday.service.CropService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping
    public List<Crop> getAll() {
        return cropService.findAll();
    }

    @GetMapping("/{id}")
    public Crop getById(@PathVariable Long id) {
        return cropService.findById(id);
    }

    @PostMapping
    public Crop create(@RequestBody Crop crop) {
        return cropService.save(crop);
    }

    @PutMapping("/{id}")
    public Crop update(@PathVariable Long id, @RequestBody Crop crop) {
        crop.setId(id);
        return cropService.save(crop);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cropService.delete(id);
    }
}
