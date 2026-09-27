package com.coffeego.dto;

public class OrderResponse {
    private boolean success;
    private String orderId;
    private String status;
    private double total;
    private int estimatedDeliveryMinutes;
    private String message;

    public OrderResponse() {
    }

    public OrderResponse(boolean success, String orderId, String status, double total, int estimatedDeliveryMinutes, String message) {
        this.success = success;
        this.orderId = orderId;
        this.status = status;
        this.total = total;
        this.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public int getEstimatedDeliveryMinutes() {
        return estimatedDeliveryMinutes;
    }

    public void setEstimatedDeliveryMinutes(int estimatedDeliveryMinutes) {
        this.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
