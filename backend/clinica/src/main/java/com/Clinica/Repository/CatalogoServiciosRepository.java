package com.Clinica.Repository;

import com.Clinica.Model.Catalogo_servicios;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CatalogoServiciosRepository extends JpaRepository<Catalogo_servicios, Integer> {

}