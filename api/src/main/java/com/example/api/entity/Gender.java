package com.example.api.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
  MALE("male"),
  FEMALE("female"),
  OTHER("other");

  private final String value;

  Gender(String value) {
    this.value = value;
  }

  @JsonCreator
  public static Gender fromString(String value) {
    for (Gender gender : Gender.values()) {
      if (gender.value.equalsIgnoreCase(value)) {
        return gender;
      }
    }
    throw new IllegalArgumentException("Unknown value: " + value);
  }

  @JsonValue
  public String getValue() {
    return value;
  }
}
