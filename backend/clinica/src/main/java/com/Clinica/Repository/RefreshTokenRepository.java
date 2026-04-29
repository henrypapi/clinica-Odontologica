package com.Clinica.Repository;

import com.Clinica.Model.RefreshToken; // Asegúrate de que esta ruta apunte a tu entidad
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Transactional
    void deleteByExpiryDateBefore(Instant now);
    
}