package com.esp.xiineday.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

/**
 * Entity representing a geographical zone with coordinates and weather data.
 */
@Entity
public class Zone {

    /** Primary key (auto-generated). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Zone name. */
    private String name;

    /** Zone type (e.g., polygon, field, region). */
    private String type;

    /** Coordinates that define this zone. */
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "zone_id") // Unidirectional; sets FK in Coordinate table
    private List<Coordinate> coordinates;

    /** Latest weather data for this zone. */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "weather_data_id")
    private WeatherData weatherData;

    public Zone() {
    }

    public Zone(Long id, String name, String type, List<Coordinate> coordinates, WeatherData weatherData) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.coordinates = coordinates;
        this.weatherData = weatherData;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Coordinate> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<Coordinate> coordinates) {
        this.coordinates = coordinates;
    }

    public WeatherData getWeatherData() {
        return weatherData;
    }

    public void setWeatherData(WeatherData weatherData) {
        this.weatherData = weatherData;
    }
}
