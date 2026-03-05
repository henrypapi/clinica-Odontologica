package com.Clinica.Repository;

import com.Clinica.Model.Odontograma;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OdontogramaRepository extends JpaRepository<Odontograma, Integer> {
    List<Odontograma> findByPaciente_IdPaciente(long idPaciente);
}