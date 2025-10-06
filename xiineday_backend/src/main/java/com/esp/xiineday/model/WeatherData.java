package com.esp.xiineday.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Entity or DTO representing detailed weather data.
 */
@Entity
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private String country;

    @Embedded
    private Coordinates coordinates;

    @Embedded
    private CurrentWeather current;

    public WeatherData() {
        this.coordinates = new Coordinates();
        this.current = new CurrentWeather();
    }

    // --- Getters & Setters ---

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getCity() { return city; }

    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }

    public void setCountry(String country) { this.country = country; }

    public Coordinates getCoordinates() { return coordinates; }

    public void setCoordinates(Coordinates coordinates) { this.coordinates = coordinates; }

    public CurrentWeather getCurrent() { return current; }

    public void setCurrent(CurrentWeather current) { this.current = current; }

    @Override
    public String toString() {
        return "WeatherData{" +
                "id=" + id +
                ", city='" + city + '\'' +
                ", country='" + country + '\'' +
                ", coordinates=" + coordinates +
                ", current=" + current +
                '}';
    }

    // --- Sous-classes pour structure JSON ---

    @Embeddable
    public static class Coordinates {
        private Double lat;
        private Double lon;

        public Coordinates() {}

        public Coordinates(Double lat, Double lon) {
            this.lat = lat;
            this.lon = lon;
        }

        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }

        public Double getLon() { return lon; }
        public void setLon(Double lon) { this.lon = lon; }

        @Override
        public String toString() {
            return "Coordinates{" + "lat=" + lat + ", lon=" + lon + '}';
        }
    }

    @Embeddable
    public static class CurrentWeather {
        private Double temp;
        private Double feelsLike;
        private Double humidity;
        private Double windSpeed;
        private String windDirection;
        private Double pressure;
        private Double precipitation;
        private Double uvIndex;
        private String condition;
        private String icon;

        public CurrentWeather() {}

        // Getters & setters

        public Double getTemp() { return temp; }
        public void setTemp(Double temp) { this.temp = temp; }

        public Double getFeelsLike() { return feelsLike; }
        public void setFeelsLike(Double feelsLike) { this.feelsLike = feelsLike; }

        public Double getHumidity() { return humidity; }
        public void setHumidity(Double humidity) { this.humidity = humidity; }

        public Double getWindSpeed() { return windSpeed; }
        public void setWindSpeed(Double windSpeed) { this.windSpeed = windSpeed; }

        public String getWindDirection() { return windDirection; }
        public void setWindDirection(String windDirection) { this.windDirection = windDirection; }

        public Double getPressure() { return pressure; }
        public void setPressure(Double pressure) { this.pressure = pressure; }

        public Double getPrecipitation() { return precipitation; }
        public void setPrecipitation(Double precipitation) { this.precipitation = precipitation; }

        public Double getUvIndex() { return uvIndex; }
        public void setUvIndex(Double uvIndex) { this.uvIndex = uvIndex; }

        public String getCondition() { return condition; }
        public void setCondition(String condition) { this.condition = condition; }

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }

        @Override
        public String toString() {
            return "CurrentWeather{" +
                    "temp=" + temp +
                    ", feelsLike=" + feelsLike +
                    ", humidity=" + humidity +
                    ", windSpeed=" + windSpeed +
                    ", windDirection='" + windDirection + '\'' +
                    ", pressure=" + pressure +
                    ", precipitation=" + precipitation +
                    ", uvIndex=" + uvIndex +
                    ", condition='" + condition + '\'' +
                    ", icon='" + icon + '\'' +
                    '}';
        }
    }
}
