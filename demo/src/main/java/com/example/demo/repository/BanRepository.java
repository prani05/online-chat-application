package com.example.demo.repository;

import com.example.demo.entity.Ban;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface BanRepository extends JpaRepository<Ban, UUID> {
}
