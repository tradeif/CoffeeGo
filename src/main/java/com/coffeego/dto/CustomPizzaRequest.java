package com.coffeego.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CustomPizzaRequest {

    @NotBlank(message = "Crust type is required")
    private String crust;

    @NotBlank(message = "Base sauce is required")
    private String base;

    @NotEmpty(message = "At least one ingredient must be selected")
    private List<String> ingredients;

    private String size = "Medium";

    public CustomPizzaRequest() {
    }

    public CustomPizzaRequest(String crust, String base, List<String> ingredients, String size) {
        this.crust = crust;
        this.base = base;
        this.ingredients = ingredients;
        this.size = size;
    }

    public String getCrust() {
        return crust;
    }

    public void setCrust(String crust) {
        this.crust = crust;
    }

    public String getBase() {
        return base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}
