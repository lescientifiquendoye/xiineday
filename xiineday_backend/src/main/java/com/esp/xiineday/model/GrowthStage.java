package com.esp.xiineday.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

/**
 * Entity representing a crop growth stage and its characteristics.
 */
@Entity
public class GrowthStage {

    /** Primary key (auto-generated). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Stage label (e.g., germination, flowering). */
    private String stage;

    /** Duration of the stage (free text, e.g., 2-3 weeks). */
    private String duration;

    /** Irrigation guidance for this stage. */
    private String irrigation;

    /**
     * Vulnerabilities associated with this stage (stored as an element collection).
     */
    @ElementCollection
    @CollectionTable(name = "growth_stage_vulnerabilities", joinColumns = @JoinColumn(name = "growth_stage_id"))
    @Column(name = "vulnerability")
    private List<String> vulnerabilities;

    public GrowthStage() {
    }

    public GrowthStage(Long id, String stage, String duration, String irrigation, List<String> vulnerabilities) {
        this.id = id;
        this.stage = stage;
        this.duration = duration;
        this.irrigation = irrigation;
        this.vulnerabilities = vulnerabilities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getIrrigation() {
        return irrigation;
    }

    public void setIrrigation(String irrigation) {
        this.irrigation = irrigation;
    }

    public List<String> getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(List<String> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
}
