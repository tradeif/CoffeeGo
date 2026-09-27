package com.coffeego.model;

import java.util.Map;

public class MenuItem {
    private String id;
    private String name;
    private String category;
    private String description;
    private double price;
    private double originalPrice;
    private String priceDisplay;
    private String imageUrl;
    private String badge;
    private boolean bestSeller;
    private boolean featured;
    private Map<String, Double> sizePrices;

    public MenuItem() {
    }

    public MenuItem(String id, String name, String category, String description, double price, double originalPrice, String priceDisplay, String imageUrl, String badge, boolean bestSeller, boolean featured, Map<String, Double> sizePrices) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice;
        this.priceDisplay = priceDisplay;
        this.imageUrl = imageUrl;
        this.badge = badge;
        this.bestSeller = bestSeller;
        this.featured = featured;
        this.sizePrices = sizePrices;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public String getPriceDisplay() {
        return priceDisplay != null ? priceDisplay : "₹" + (int)price;
    }

    public void setPriceDisplay(String priceDisplay) {
        this.priceDisplay = priceDisplay;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public boolean isBestSeller() {
        return bestSeller;
    }

    public void setBestSeller(boolean bestSeller) {
        this.bestSeller = bestSeller;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public Map<String, Double> getSizePrices() {
        return sizePrices;
    }

    public void setSizePrices(Map<String, Double> sizePrices) {
        this.sizePrices = sizePrices;
    }
}
