package com.coffeego.dto;

public class SubscribeResponse {
    private boolean success;
    private String message;
    private String promoCode;
    private int discountPercent;

    public SubscribeResponse() {
    }

    public SubscribeResponse(boolean success, String message, String promoCode, int discountPercent) {
        this.success = success;
        this.message = message;
        this.promoCode = promoCode;
        this.discountPercent = discountPercent;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(int discountPercent) {
        this.discountPercent = discountPercent;
    }
}
