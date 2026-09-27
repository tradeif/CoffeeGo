package com.coffeego.model;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    private List<CartItem> items = new ArrayList<>();
    private double subtotal;
    private double discount;
    private double deliveryFee;
    private double total;
    private String discountCode;
    private int totalItemCount;

    public Cart() {
        this.deliveryFee = 0.00;
        recalculate();
    }

    public void recalculate() {
        double sum = 0.0;
        int count = 0;
        for (CartItem item : items) {
            sum += item.getTotalPrice();
            count += item.getQuantity();
        }
        this.subtotal = Math.round(sum * 100.0) / 100.0;
        this.totalItemCount = count;
        
        // If discount code COFFEEGO10 is applied
        if ("COFFEEGO10".equalsIgnoreCase(this.discountCode)) {
            this.discount = Math.round((this.subtotal * 0.10) * 100.0) / 100.0;
        } else {
            this.discount = 0.0;
        }
        
        double finalTotal = this.subtotal - this.discount + (this.items.isEmpty() ? 0.0 : this.deliveryFee);
        this.total = Math.max(0.0, Math.round(finalTotal * 100.0) / 100.0);
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
        recalculate();
    }

    public double getSubtotal() {
        return subtotal;
    }

    public double getDiscount() {
        return discount;
    }

    public double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(double deliveryFee) {
        this.deliveryFee = deliveryFee;
        recalculate();
    }

    public double getTotal() {
        return total;
    }

    public String getDiscountCode() {
        return discountCode;
    }

    public void setDiscountCode(String discountCode) {
        this.discountCode = discountCode;
        recalculate();
    }

    public int getTotalItemCount() {
        return totalItemCount;
    }
}
