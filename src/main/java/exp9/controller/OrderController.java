package exp9.controller;

import exp9.entity.Order;
import exp9.repository.OrderRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .body(orderRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {

        return orderRepository.findById(id)
                .map(order -> ResponseEntity.ok()
                        .header("Access-Control-Allow-Origin", "*")
                        .body(order))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {

        Order savedOrder = orderRepository.save(order);

        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .body(savedOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable Long id,
            @RequestBody Order order) {

        return orderRepository.findById(id)
                .map(existingOrder -> {

                    existingOrder.setCustomer(order.getCustomer());
                    existingOrder.setTotal(order.getTotal());
                    existingOrder.setAddress(order.getAddress());
                    existingOrder.setPaymentMode(order.getPaymentMode());
                    existingOrder.setStatus(order.getStatus());
                    existingOrder.setDate(order.getDate());

                    Order updatedOrder =
                            orderRepository.save(existingOrder);

                    return ResponseEntity.ok()
                            .header("Access-Control-Allow-Origin", "*")
                            .body(updatedOrder);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {

        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        orderRepository.deleteById(id);

        return ResponseEntity.noContent()
                .header("Access-Control-Allow-Origin", "*")
                .build();
    }
}