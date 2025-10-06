package com.esp.xiineday.service;

import com.esp.xiineday.model.WeatherData;
import com.esp.xiineday.service.exception.MeteomaticsApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service Meteomatics pour récupérer toutes les données météo en temps réel.
 * Structure complète avec coordonnées et "current" imbriqué.
 */
@Service
public class MeteomaticsServiceDirect implements MeteomaticsService {

    @Value("${meteomatics.username}")
    private String username;

    @Value("${meteomatics.password}")
    private String password;

    private static final String BASE_URL = "https://api.meteomatics.com";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public WeatherData getCurrentWeather(double lat, double lon, double altitude) {
        List<String> params = Arrays.asList(
                "t_2m:C",                  // Température
                "wind_speed_10m:ms",       // Vitesse du vent
                "wind_dir_10m:d",          // Direction du vent
                "precip_1h:mm",            // Précipitations
                "relative_humidity_2m:p",  // Humidité
                "msl_pressure:hPa",        // Pression
                "uv:idx"                   // Index UV
        );
        return getCurrentWeather(lat, lon, altitude, params);
    }

    @Override
    public WeatherData getCurrentWeather(double lat, double lon, double altitude, List<String> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            throw new IllegalArgumentException("parameters must not be null or empty");
        }

        String paramsJoined = String.join(",", parameters);
        String url = String.format("%s/now/%s/%f,%f/json", BASE_URL, paramsJoined, lat, lon);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(username, password);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> body = response.getBody();
            if (body == null) throw new MeteomaticsApiException("Réponse vide de l'API Meteomatics");

            // --- Transformation en WeatherData ---
            return mapToWeatherData(body, lat, lon);

        } catch (RestClientException e) {
            throw new MeteomaticsApiException("Erreur lors de l'appel API Meteomatics: " + e.getMessage(), e);
        }
    }

    // --- Mapping brut des données API vers WeatherData ---
    private WeatherData mapToWeatherData(Map<String, Object> body, double lat, double lon) {
        double temp = getDoubleValue(body, "t_2m:C");
        double windSpeed = getDoubleValue(body, "wind_speed_10m:ms");
        double humidity = getDoubleValue(body, "relative_humidity_2m:p");
        double pressure = getDoubleValue(body, "msl_pressure:hPa");
        double precip = getDoubleValue(body, "precip_1h:mm");
        double uv = getDoubleValue(body, "uv:idx");
        double windDir = getDoubleValue(body, "wind_dir_10m:d");

        WeatherData data = new WeatherData();
        data.setCity("Dakar");
        data.setCountry("Sénégal");
        data.getCoordinates().setLat(lat);
        data.getCoordinates().setLon(lon);

        WeatherData.CurrentWeather current = new WeatherData.CurrentWeather();
        current.setTemp(temp);
        current.setFeelsLike(calculateFeelsLike(temp, humidity, windSpeed));
        current.setHumidity(humidity);
        current.setWindSpeed(windSpeed);
        current.setWindDirection(convertDirection(windDir));
        current.setPressure(pressure);
        current.setPrecipitation(precip);
        current.setUvIndex(uv);
        current.setCondition(describeCondition(temp, precip, uv));
        current.setIcon(selectIcon(current.getCondition()));

        data.setCurrent(current);

        return data;
    }

    // --- Méthodes utilitaires ---
    @SuppressWarnings("unchecked")
    private double getDoubleValue(Map<String, Object> body, String key) {
        try {
            List<Map<String, Object>> dataList = (List<Map<String, Object>>) body.get("data");
            for (Map<String, Object> series : dataList) {
                if (key.equals(series.get("parameter"))) {
                    List<Map<String, Object>> coordinates = (List<Map<String, Object>>) series.get("coordinates");
                    if (coordinates != null && !coordinates.isEmpty()) {
                        List<Map<String, Object>> dates = (List<Map<String, Object>>) coordinates.get(0).get("dates");
                        if (dates != null && !dates.isEmpty()) {
                            Object value = dates.get(0).get("value");
                            return (value instanceof Number) ? ((Number) value).doubleValue() : Double.NaN;
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
        return Double.NaN;
    }

    private double calculateFeelsLike(double temp, double humidity, double windSpeed) {
        double feels = temp + (humidity / 100 * 2) - (windSpeed * 0.7);
        return Math.round(feels * 10.0) / 10.0;
    }

    private String convertDirection(double degrees) {
        String[] dirs = {"N", "NE", "E", "SE", "S", "SW", "W", "NW"};
        return dirs[(int) Math.round(((degrees % 360) / 45)) % 8];
    }

    private String describeCondition(double temp, double precip, double uv) {
        if (precip > 1) return "Pluvieux";
        if (uv > 7) return "Ensoleillé";
        if (temp < 20) return "Frais";
        return "Clair";
    }

    private String selectIcon(String condition) {
        return switch (condition) {
            case "Pluvieux" -> "rain";
            case "Ensoleillé" -> "sun";
            case "Frais" -> "cloud";
            default -> "partly_cloudy";
        };
    }
}
