package com.vtcorp.store.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "voucher")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long voucherId;
    private String title;
    private Integer limit;
    private Integer appliedCount;
    private Integer type;
    private String description;
    private Double discountRate;
    private Double validMaxDiscount;
    private Double discountPrice;
    private Double validMinPrice;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date expiryDate;
    private boolean active;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL)
    private List<Order> orders;

    @ManyToMany(mappedBy = "vouchers")
    private List<User> users;

}
