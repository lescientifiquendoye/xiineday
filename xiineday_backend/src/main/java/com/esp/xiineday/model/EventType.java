package com.esp.xiineday.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

/**
 * Entity describing a type of agricultural event with its ideal conditions.
 */
@Entity
public class EventType {

    /** Primary key (auto-generated). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Event type name (e.g., planting, spraying). */
    private String type;

    /** Duration of the event (unit as per domain definition). */
    private int duration;

    /** Ideal conditions for this event. */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ideal_conditions_id")
    private IdealConditions idealConditions;

    public EventType() {
    }

    public EventType(Long id, String type, int duration, IdealConditions idealConditions) {
        this.id = id;
        this.type = type;
        this.duration = duration;
        this.idealConditions = idealConditions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public IdealConditions getIdealConditions() {
        return idealConditions;
    }

    public void setIdealConditions(IdealConditions idealConditions) {
        this.idealConditions = idealConditions;
    }
}
