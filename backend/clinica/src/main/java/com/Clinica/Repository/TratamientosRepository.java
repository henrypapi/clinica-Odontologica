package com.Clinica.Repository;

import com.Clinica.Dto.DemandaServicioProjection;
import com.Clinica.Model.Tratamientos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface TratamientosRepository extends JpaRepository<Tratamientos, Integer> {
    List<Tratamientos> findByPaciente_IdPaciente(Integer idPaciente);
    @Query("SELECT COALESCE(SUM(t.abonado), 0.0) FROM Tratamientos t WHERE MONTH(t.fechaCreacion) = :mes AND YEAR(t.fechaCreacion) = :anio")
    Double sumarIngresosDelMes(@Param("mes") int mes, @Param("anio") int anio);
    @Query("SELECT t.catalogo.nombre AS nombre, COUNT(t) AS cantidad " +
           "FROM Tratamientos t " +
           "GROUP BY t.catalogo.nombre " +
           "ORDER BY cantidad DESC")
    List<DemandaServicioProjection> obtenerDemandaServicios();
    
}

