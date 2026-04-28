package com.Clinica.Repository;

import com.Clinica.Model.Citas;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CitasRepository extends JpaRepository<Citas, Integer> {
    List<Citas> findByPaciente_IdPaciente(Integer idPaciente);
    Long countByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Citas> findByFechaHoraBetweenOrderByFechaHoraAsc(LocalDateTime inicio, LocalDateTime fin);
}