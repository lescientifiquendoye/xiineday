package com.esp.xiineday.controller;

import com.esp.xiineday.model.WeatherData;
import com.esp.xiineday.service.MeteomaticsService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/weather", produces = MediaType.APPLICATION_JSON_VALUE)
public class MeteomaticsController {

    private final MeteomaticsService meteomaticsService;

    public MeteomaticsController(MeteomaticsService meteomaticsService) {
        this.meteomaticsService = meteomaticsService;
    }

    /**
     * Example:
     *   GET /api/weather/current?lat=47.0&lon=8.0&altitude=500
     *   GET /api/weather/current?lat=47.0&lon=8.0&altitude=500&params=t_2m:C,wind_10m:ms,precip_1h:mm
     */
    @GetMapping("/current")
    public WeatherData getCurrentWeather(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam double altitude,
            @RequestParam(name = "params", required = false) String params
    ) {
        if (params == null || params.isBlank()) {
            return meteomaticsService.getCurrentWeather(lat, lon, altitude);
        }
        List<String> paramList = Arrays.stream(params.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        return meteomaticsService.getCurrentWeather(lat, lon, altitude, paramList);
    }
}

