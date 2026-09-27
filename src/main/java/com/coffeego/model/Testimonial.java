package com.coffeego.model;

public class Testimonial {
    private String id;
    private String name;
    private String role;
    private String review;
    private String avatarUrl;
    private int rating;
    private String date;
    private String platform;

    public Testimonial() {
    }

    public Testimonial(String id, String name, String role, String review, String avatarUrl, int rating, String date, String platform) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.review = review;
        this.avatarUrl = avatarUrl;
        this.rating = rating;
        this.date = date;
        this.platform = platform;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public String getAvatarUrl() {
        return imageUrl();
    }

    public String imageUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }
}
