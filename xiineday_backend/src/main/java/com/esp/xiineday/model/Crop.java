package com.esp.xiineday.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

/**
 * Entity representing a crop with its lifecycle and requirements.
 */
@Entity
public class Crop {

    /** Primary key (auto-generated). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Crop name. */
    private String name;

    /** Planting period (e.g., months or season). */
    private String plantingPeriod;

    /** Harvest period (e.g., months or season). */
    private String harvestPeriod;

    /** Water requirements description. */
    private String waterRequirements;

    /** Ideal conditions for this crop. */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ideal_conditions_id")
    private IdealConditions idealConditions;

    /** Growth stages for this crop (eagerly loaded). */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id") // Unidirectional; sets FK in GrowthStage table
    private List<GrowthStage> growthStages;

    public Crop() {
    }

    public Crop(Long id, String name, String plantingPeriod, String harvestPeriod, String waterRequirements,
                IdealConditions idealConditions, List<GrowthStage> growthStages) {
        this.id = id;
        this.name = name;
        this.plantingPeriod = plantingPeriod;
        this.harvestPeriod = harvestPeriod;
        this.waterRequirements = waterRequirements;
        this.idealConditions = idealConditions;
        this.growthStages = growthStages;
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

    public String getPlantingPeriod() {
        return plantingPeriod;
    }

    public void setPlantingPeriod(String plantingPeriod) {
        this.plantingPeriod = plantingPeriod;
    }

    public String getHarvestPeriod() {
        return harvestPeriod;
    }

    public void setHarvestPeriod(String harvestPeriod) {
        this.harvestPeriod = harvestPeriod;
    }

    public String getWaterRequirements() {
        return waterRequirements;
    }

    public void setWaterRequirements(String waterRequirements) {
        this.waterRequirements = waterRequirements;
    }

    public IdealConditions getIdealConditions() {
        return idealConditions;
    }

    public void setIdealConditions(IdealConditions idealConditions) {
        this.idealConditions = idealConditions;
    }

    public List<GrowthStage> getGrowthStages() {
        return growthStages;
    }

    public void setGrowthStages(List<GrowthStage> growthStages) {
        this.growthStages = growthStages;
    }
}
