package com.Clinica.Repository;

import com.Clinica.Model.Pago; // Asegúrate de que esta importación coincida con tu clase Modelo
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagosRepository extends JpaRepository<Pago, Integer> {


}