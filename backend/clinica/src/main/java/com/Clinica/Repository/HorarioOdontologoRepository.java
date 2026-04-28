package com.Clinica.Repository;

import com.Clinica.Model.HorarioOdontologo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HorarioOdontologoRepository extends JpaRepository<HorarioOdontologo, Integer> {
    List<HorarioOdontologo> findByOdontologo_IdUsuarioAndDiaSemana(Integer idUsuario, Integer diaSemana);
    List<HorarioOdontologo> findByOdontologoIdUsuario(Integer idOdontologo);
    void deleteByOdontologoIdUsuario(Integer idOdontologo);
}