package com.esp.xiineday.service;

import com.esp.xiineday.model.WeatherData;

import java.util.List;

/**
 * Service to fetch real-time weather data from Meteomatics API without persisting it.
 */
public interface MeteomaticsService {

    /**
     * Basic current weather for a coordinate using default parameters (temperature, wind, precipitation).
     * @param lat latitude
     * @param lon longitude
     * @param altitude altitude in meters
     * @return WeatherData snapshot
     */
    WeatherData getCurrentWeather(double lat, double lon, double altitude);

    /**
     * Current weather for a coordinate with custom Meteomatics parameters (e.g., t_2m:C, wind_10m:ms,...).
     * @param lat latitude
     * @param lon longitude
     * @param altitude altitude in meters
     * @param parameters list of Meteomatics parameter strings
     * @return WeatherData snapshot
     */
    WeatherData getCurrentWeather(double lat, double lon, double altitude, List<String> parameters);
}
