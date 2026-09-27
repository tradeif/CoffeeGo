package com.coffeego.model;

public class Promotion {
    private String id;
    private String title;
    private String subtitle;
    private String highlight;
    private String discount;
    private String badge;
    private String imageUrl;
    private String bgColor;
    private String hotline;

    public Promotion() {
    }

    public Promotion(String id, String title, String subtitle, String highlight, String discount, String badge, String imageUrl, String bgColor, String hotline) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.highlight = highlight;
        this.discount = discount;
        this.badge = badge;
        this.imageUrl = imageUrl;
        this.bgColor = bgColor;
        this.hotline = hotline;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getHighlight() {
        return highlight;
    }

    public void setHighlight(String highlight) {
        this.highlight = highlight;
    }

    public String getDiscount() {
        return discount;
    }

    public void setDiscount(String discount) {
        this.discount = discount;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getBgColor() {
        return bgColor;
    }

    public void setBgColor(String bgColor) {
        this.bgColor = bgColor;
    }

    public String getHotline() {
        return hotline;
    }

    public void setHotline(String hotline) {
        this.hotline = hotline;
    }
}
