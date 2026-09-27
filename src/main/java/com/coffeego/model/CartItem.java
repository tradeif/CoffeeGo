package com.coffeego.model;

import java.util.List;

public class CartItem {
    private String id;
    private String menuItemId;
    private String name;
    private double unitPrice;
    private int quantity;
    private String size;
    private String imageUrl;
    private List<String> customizations;

    public CartItem() {
    }

    public CartItem(String id, String menuItemId, String name, double unitPrice, int quantity, String size, String imageUrl, List<String> customizations) {
        this.id = id;
        this.menuItemId = menuItemId;
        this.name = name;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.size = size;
        this.imageUrl = imageUrl;
        this.customizations = customizations;
    }

    public double getTotalPrice() {
        return unitPrice * quantity;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(String menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getCustomizations() {
        return customizations;
    }

    public void setCustomizations(List<String> customizations) {
        this.customizations = customizations;
    }
}
