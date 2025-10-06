package com.esp.xiineday.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Entity representing the ideal environmental conditions for crops/events.
 */
@Entity
public class IdealConditions {

    /** Primary key (auto-generated). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Minimal temperature in °C. */
    private Double tempMin;

    /** Maximal temperature in °C. */
    private Double tempMax;

    /** Maximal acceptable precipitation (mm). */
    private Double precipitationMax;

    /** Maximal wind speed (m/s or km/h depending on context). */
    private Double windSpeedMax;

    /** Minimal rainfall over a relevant window (mm). */
    private Double rainfallMin;

    /** Maximal rainfall over a relevant window (mm). */
    private Double rainfallMax;

    /** Soil moisture description (e.g., percentage or qualitative). */
    private String soilMoisture;

    /** Free text description. */
    private String description;

    public IdealConditions() {
    }

    public IdealConditions(Long id, Double tempMin, Double tempMax, Double precipitationMax, Double windSpeedMax,
                           Double rainfallMin, Double rainfallMax, String soilMoisture, String description) {
        this.id = id;
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.precipitationMax = precipitationMax;
        this.windSpeedMax = windSpeedMax;
        this.rainfallMin = rainfallMin;
        this.rainfallMax = rainfallMax;
        this.soilMoisture = soilMoisture;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTempMin() {
        return tempMin;
    }

    public void setTempMin(Double tempMin) {
        this.tempMin = tempMin;
    }

    public Double getTempMax() {
        return tempMax;
    }

    public void setTempMax(Double tempMax) {
        this.tempMax = tempMax;
    }

    public Double getPrecipitationMax() {
        return precipitationMax;
    }

    public void setPrecipitationMax(Double precipitationMax) {
        this.precipitationMax = precipitationMax;
    }

    public Double getWindSpeedMax() {
        return windSpeedMax;
    }

    public void setWindSpeedMax(Double windSpeedMax) {
        this.windSpeedMax = windSpeedMax;
    }

    public Double getRainfallMin() {
        return rainfallMin;
    }

    public void setRainfallMin(Double rainfallMin) {
        this.rainfallMin = rainfallMin;
    }

    public Double getRainfallMax() {
        return rainfallMax;
    }

    public void setRainfallMax(Double rainfallMax) {
        this.rainfallMax = rainfallMax;
    }

    public String getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(String soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
